import Sidebar from "../Consultant"
export default function ConsultantLayout({
  children,
}: {
  children: React.ReactNode
}) {
   return (   
   <div className="flex-shrink-0 w-[350px] flex items-center w-full" >
        <Sidebar />
        <main className="w-full">{children}</main>
    </div>
    )
    }