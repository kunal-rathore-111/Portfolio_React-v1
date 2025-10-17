

export const ContactDiv = (props) => {


    return (
        <span
            className="text-xl  border-2 border-slate-500 py-1 px-2 rounded cursor-pointer flex gap-2 items-center"
        >
            {props.icon ? props.icon : ""}
            <span>{props?.title}</span>

        </span>

    )
}