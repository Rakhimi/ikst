import MaxWidthWrapper from "@/components/MaxWidthWrapper";

export default function Home() {
  return (
    <div className="relative w-full h-screen">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: "url('/hijab.jpg')" }}
      ></div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Text Content */}
      <MaxWidthWrapper>
        <div className="relative z-10 flex items-start justify-start h-full p-10">
          <div className="text-white max-w-md">
            <h1 className="text-4xl italic font-semibold">
              ISLAMIC KNOWLEDGE STANDARDIZED TESTING
            </h1>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
