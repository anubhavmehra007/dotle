export default function Keyboard(props) {
    const virtInput = props.virtInput;
    const keys = [['q','w','e','r','t','y','u','i','o' ,'p'],
                  ['a', 's','d', 'f', 'g', 'h', 'j', 'k', 'l'],
                  ['BCK','z','x','c', 'v','b','n','m','ENT']];
    const firstRow = keys[0].map( key => {
        return (
            <button id={key} key={key} className = "virtKey" onClick={() => {virtInput(key)} }>{key.toUpperCase()}</button>
        ) });
    const secondRow = keys[1].map( key => {
        return (
            <button id={key} key={key} className = "virtKey" onClick={() => {virtInput(key)} }>{key.toUpperCase()}</button>
        )
    });
    const thirdRow = keys[2].map( key => {
        return (
            <button id={key} key= {key} className = "virtKey" onClick={() => {virtInput(key)} }>{key.toUpperCase()}</button>
        )
    });

    return (<div className="virtKeyboard">
        <div>{firstRow}{"\n"}</div>
        <div>{secondRow}{"\n"}</div>
        <div>{thirdRow}{"\n"}</div>
    </div>);
}