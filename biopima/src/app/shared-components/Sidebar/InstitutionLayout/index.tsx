
import Sidebar from  "../Institution";
export default function InstitutionLayout({
  children,
}: {
  children: React.ReactNode
}) {
   return (
          
     <div className="flex-shrink-0 w-[350px]">
            <Sidebar />   
      <main>{children}</main>
    </div>
          
      
      )
      }