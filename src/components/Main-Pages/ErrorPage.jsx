import { useNavigate } from "react-router-dom"



export const ErrorPage = () => {

    const navigate = useNavigate();
    function navigateFunc() {
        navigate('/')
    }

    return <div className="dark:text-white dark:bg-black w-[95%] min-h-screen flex items-center justify-center">
        <div className="p-2 flex flex-col items-center gap-6">
            <span className="text-6xl">404</span>
            <span className="text-4xl">Page not found</span>


            <div className="text-2xl flex flex-col gap-3">
                <span className="ring-2 ring-blue-800 hover:ring-green-500 py-1 px-2 rounded-xl cursor-pointer" onClick={navigateFunc} >Go to home page</span>
            </div>
        </div>
    </div>
}