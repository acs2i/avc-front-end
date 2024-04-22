export default function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto w-[400px] md:w-[600px] lg:w-[800px] xl:w-[1200px]">
      {children}
    </div>
  )
}