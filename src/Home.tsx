interface IHomeProps {
    onStart: () => void
}


export default function Home(props: IHomeProps) {
    const {onStart} = props;
    return  (
        <div onClick={onStart}>
            <div 
            <button>Start!</button>
        </div>
    )
}