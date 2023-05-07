
export default function BlueButton(props: any){

    return(
        <button type="submit" className="text-white bg-blue-600 rounded-lg w-full py-1.5 hover:bg-blue-700" >{props.children}</button>
    )
}