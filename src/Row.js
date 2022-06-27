
export default function Row(props) {
    const divs = []
    for(let i = 0; i < props.answer.length; i++)
    {
        divs.push(
        (<div key={`row-${props.rowNum}-input-${i}`} className='input' data-state='idle' id={`row-${props.rowNum}-input-${i}`} >
            
        </div>)
        )
    }
    return (
        <div className='row' id ={`row-${props.rowNum}`}>
            {divs}
        </div>
    )

}