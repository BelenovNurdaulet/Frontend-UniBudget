
import {Divider} from "@ozen-ui/kit/Divider";
import {AppBar} from "../components/AppBar/AppBar.jsx";
import {AppBarBody} from "../components/AppBar/components/AppBarBody/AppBarBody.jsx";
import {Navigation} from "../components/Navigation/Navigation.jsx";
import {AppBarFooter} from "../components/AppBar/components/AppBarFooter/AppBarFooter.jsx";
import {AppProvider} from "./AppContext.jsx";
import {Content} from "../components/Content/Content.jsx";
import {AppBarProvider} from "../components/AppBar/AppBarContext.jsx";
import {Profile} from "../components/Profile/Profile.jsx";


function App() {
    return (
        <AppProvider>
            <AppBarProvider >
                <AppBar>

                    <Divider />
                    <AppBarBody>
                        <Navigation />
                    </AppBarBody>
                    <Divider />
                    <AppBarFooter>
                       < Profile/>
                    </AppBarFooter>

                </AppBar>
                <Content/>
            </AppBarProvider >
        </AppProvider>
    )
}

export default App
