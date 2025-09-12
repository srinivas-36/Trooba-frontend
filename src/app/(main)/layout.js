import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { PageHeaderProvider } from "@/components/PageHeaderContext";

export default function MainLayout({ children }) {
    return (
        <PageHeaderProvider>

            <div className="flex h-screen">
                {/* Sidebar stays fixed */}
                <Sidebar />

                <div className="flex-1 flex flex-col">
                    {/* Navbar */}
                    <Navbar />

                    {/* Page content scrolls */}
                    <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </PageHeaderProvider>
    );
}
