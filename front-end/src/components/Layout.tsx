//Layout.tsx
//This allows us to have the website and content class for each page
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <div className="website">
            <div className="content">
                <Outlet /> {/* This will render the matched route's component */}
            </div>
        </div>
    );
};

export default Layout;
