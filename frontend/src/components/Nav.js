import { Link } from "react-router-dom";

const Nav = (props) => {
    return (
        <div className="nav">
            <Link to='/'>
                <div>STOCKTICKER HOMEPAGE</div>
            </Link>
            <Link to='/stocks'>
                <div>STOCKS</div>
            </Link>
        </div>
    )
}

export default Nav