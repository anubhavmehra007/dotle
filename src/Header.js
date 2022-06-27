import dota from "./images/dota.png";
export default function Header() {
    return (<nav className="navbar">
        <img src={dota} alt="logo" />
        <h3>DOTLE</h3>
    </nav>)
}