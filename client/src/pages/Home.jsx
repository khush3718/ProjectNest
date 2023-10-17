import Clients from "../components/Clients";
import Projects from "../components/Projects";
import AddClientModal from "../components/AddClientModal";
import AddProjectModal from "../components/AddProjectModal";

export default function Home() {
    return (
        <>
            <div className="d-flex gap-3 mb-4">
                <AddClientModal />
                <AddProjectModal />
            </div>
            <div className="d-flex justify-content-between align-items-center">
                <h1>Projects</h1>
            </div>
            <Projects />
            <hr />
            <div className="d-flex justify-content-between align-items-center">
                <h1>Client Info</h1>
            </div>
            <Clients />
        </>
    )
}
