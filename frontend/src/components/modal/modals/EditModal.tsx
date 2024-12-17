import { FormEvent, useState } from "react"
import { useModal } from "../ModalProvider";
import { storage } from "@neutralinojs/lib";

const EditModal = () => {

    const { getModalProps, closeModal } = useModal()
    const { setDevices, device }: { setDevices: React.Dispatch<React.SetStateAction<IDevice[]>>, device: IDevice } = getModalProps();

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
            const newDevices = devices.map(d => {
                if (d.uid === device.uid) {
                    return { macAddress, deviceName, address, port, interval, uid: device.uid }
                }
                return d
            });
            storage.setData("devices", JSON.stringify(newDevices));
            return newDevices;
        });

        setButtonDisabled(true);
        closeModal()
    }

    return (
        <div className="text-white">
            <h1 className="font-bold text-xl">Editing {device.deviceName}</h1>
            <form onSubmit={deviceSubmit} className="grid grid-cols-2 gap-3 mt-3">
                <input required className="input col-span-2" type="text" autoComplete={"off"} name="macAddress" defaultValue={device.macAddress} placeholder="Mac Address" id="" />
                <input required className="input" type="text" name="deviceName" autoComplete={"off"} defaultValue={device.deviceName} placeholder="Device Name" id="" />
                <input required className="input" type="text" name="address" autoComplete={"off"} defaultValue={device.address} placeholder="IP Address" id="" />
                <input className="input" type="number" name="port" autoComplete={"off"} placeholder="Port (Default: 9)" id="" />
                <input className="input" type="number" name="interval" autoComplete={"off"} placeholder="Interval (Default: 100)" id="" />
                <button disabled={buttonDisabled} className="col-span-2 btn">Edit</button>
            </form>
        </div>
    )
}

export default EditModal