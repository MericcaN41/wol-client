import { FormEvent, useState } from "react"
import { useModal } from "../ModalProvider";
import { storage } from "@neutralinojs/lib";

const DeviceModal = () => {

    const { getModalProps, closeModal } = useModal()
    const { setDevices }: { setDevices: React.Dispatch<React.SetStateAction<IDevice[]>> } = getModalProps();

    const [buttonDisabled, setButtonDisabled] = useState(false);

    const deviceSubmit = (e: FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const deviceName = formData.get("deviceName") as string;
        const address = formData.get("address") as string;
        const port = Number(formData.get("port")) || 9;
        const interval = Number(formData.get("interval")) || 100;
        const macAddress = formData.get("macAddress") as string

        setDevices(devices => {
            const newDevices = [...devices, ({ macAddress, deviceName, address, port, interval, uid: crypto.randomUUID() } as IDevice)];
            storage.setData("devices", JSON.stringify(newDevices));
            return newDevices;
        });

        setButtonDisabled(true);
        closeModal()
    }

    return (
        <div className="text-white">
            <h1 className="font-bold text-xl">Add Device</h1>
            <p className="text-white/70 text-sm">Add a new device to your list</p>
            <form onSubmit={deviceSubmit} className="grid grid-cols-2 gap-3 mt-3">
                <input required className="input col-span-2" type="text" autoComplete={"off"} name="macAddress" placeholder="Mac Address" id="" />
                <input required className="input" type="text" name="deviceName" autoComplete={"off"} placeholder="Device Name" id="" />
                <input required className="input" type="text" name="address" autoComplete={"off"} placeholder="IP Address" id="" />
                <input className="input" type="number" name="port" autoComplete={"off"} placeholder="Port (Default: 9)" id="" />
                <input className="input" type="number" name="interval" autoComplete={"off"} placeholder="Interval (Default: 100)" id="" />
                <button disabled={buttonDisabled} className="col-span-2 btn">Add</button>
            </form>
        </div>
    )
}

export default DeviceModal