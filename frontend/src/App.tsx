import { debug, events, extensions, storage } from "@neutralinojs/lib";
import { useEffect, useState } from "react";
import { IoServer } from "react-icons/io5";
import { MdOutlineAddCircle } from "react-icons/md";
import { useModal } from "./components/modal/ModalProvider";
import Device from "./components/Device";

const App = () => {
    const [devices, setDevices] = useState<IDevice[]>([])
    const { openModal } = useModal()

    useEffect(() => {
        if (devices.length === 0) {
            storage.getData("devices").then((data: any) => {
                setDevices(JSON.parse(data))
            }).catch(() => {
                storage.setData("devices", JSON.stringify([]));
            })
        }
    }, [devices])

    useEffect(() => {
        const onWindowClose = (type: string) => {
            debug.log("Window close event: " + type)
            extensions.dispatch("js.wol-client.wol", "exitProgram", {})
        }   

        events.on("windowClose", () => onWindowClose("windowClose"))
        events.on("clientDisconnect", () => onWindowClose("clientDisconnect"))
        events.on("appClientDisconnect", () => onWindowClose("appClientDisconnect"))

    }, [])

    return (
        <main className="bg-zinc-700 flex flex-col h-screen text-white p-5">
            <h1 className="font-bold text-2xl">Easy WOL Client</h1>
            <p className="text-white/70">Wake up your computer with a single click</p>
            {
                devices.length > 0 ?
                    <>
                        <div className="flex justify-between items-center mt-3 mb-1">
                            <h1 className="font-bold text-lg">Devices</h1>
                            <MdOutlineAddCircle className="text-2xl cursor-pointer" onClick={() => openModal("DeviceModal", { setDevices })} />
                        </div>
                        <div className="flex flex-col gap-3">
                            {
                                devices.map((device) => {
                                    return (
                                        <Device key={device.uid} device={device} setDevices={setDevices} />
                                    )
                                })
                            }
                        </div>
                    </> : <div
                        onClick={() => openModal("DeviceModal", { setDevices })}
                        className="flex flex-col flex-1 border-[5px] border-white/5 border-dashed mt-5 cursor-pointer hover:border-white/25 group">
                        <div className="flex flex-col gap-3 items-center justify-center h-full">
                            <IoServer className="text-white/50 text-5xl group-hover:text-white/85" />
                            <p className="text-white/50 group-hover:text-white/85">No devices found, click to add one!</p>
                        </div>
                    </div>
            }
        </main>
    );
}

export default App;
