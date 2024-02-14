function Timeline(props) {

    if (!props.hourData || props.hourData.length === undefined) {
        return (
            <div className="loading-state w-full h-full text-white font-semibold">
                Loading hourly forecast...
            </div>
        );
    }
    return (
        <>
            {props.hourData.map((objects) => {
                return (
                    <div className="flex flex-col items-center justify-evenly bg-transparent text-white font-semibold text-opacity-100">
                        <p className="text-white font-semibold">{objects.time.slice(11, 16)}</p>
                        <img src={objects.condition.icon} alt="" />
                        <p >{objects.temp_c}</p>
                    </div>
                )
            })}
        </>
    )
}
export default Timeline;