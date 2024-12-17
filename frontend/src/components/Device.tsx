import { events, extensions, storage } from "@neutralinojs/lib";
import { useModal } from "./modal/ModalProvider";
import { useEffect, useState } from "react";

const Device = ({ device, setDevices }: { device: IDevice, setDevices: React.Dispatch<React.SetStateAction<IDevice[]>> }) => {

    const { openModal } = useModal()
    const [status, setStatus] = useState(0);
    const [isWaking, _] = useState(true);

    const removeDevice = () => {
        setDevices(devices => {
            const newDevices = devices.filter(d => d.uid !== device.uid);
            storage.setData("devices", JSON.stringify(newDevices));
            return newDevices;
        })
    }

    const wakeDevice = () => {
        console.log("Waking device")
        extensions.dispatch("js.wol-client.wol", "wakeDevice", {
            mac: device.macAddress,
            ip: device.address,
            uid: device.uid
        })
    }


    useEffect(() => {
        extensions.dispatch("js.wol-client.wol", "checkDevice", {
            mac: device.macAddress,
            ip: device.address,
            uid: device.uid,
            max: 1
        })
    }, [])

    useEffect(() => {
        events.on("wakeResponse", (data) => {
            if (data.detail.id === device.uid) {
                switch (data.detail.type) {
                    case "checking":
                        setStatus(0)
                        break;
                    case "online":
                        setStatus(1)
                        break;
                    case "offline":
                        setStatus(2)
                        break;
                }
            }
        })
    }, [])

    return (
        <div className="gap-3 border border-white/15 rounded-md p-2 px-4">
            <div className="flex justify-between">
                <p className="font-bold">{device.deviceName}</p>
                {
                    status === 0 ? <p className="text-white/50 text-sm">Status: <span className="text-orange-400">CHECKING</span></p> :
                        status === 1 ? <p className="text-white/50 text-sm">Status: <span className="text-green-400">ONLINE</span></p> :
                            <p className="text-white/50 text-sm">Status: <span className="text-red-400">OFFLINE</span></p>
                }
            </div>
            <div className="flex justify-between">
                <div>
                    <p className="text-sm text-white/50">{device.macAddress}</p>
                    <p className="text-sm text-white/50">{device.address}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button disabled={(isWaking && status !== 2)} className="btn" onClick={wakeDevice}>Wake</button>
                    <button className="btn" onClick={() => openModal("EditModal", {
                        device: device,
                        setDevices: setDevices
                    })}>Edit</button>
                    <button className="btn" onClick={() => openModal("ConfirmModal", {
                        title: "Are you sure you want to remove this device?",
                        callback: removeDevice
                    }, false)}>Remove</button>
                </div>
            </div>
        </div>
    )
}

export default Device;