import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Image from "next/image";

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
        <div className="relative z-10 flex items-start gap-4 justify-start h-full p-10">
          <div>
            <Image
              src="/IKST_LOGO.png"
              alt="Home Image"
              width={200}
              height={100}
            />
          </div>
          <div className="bg-white max-w-md p-2 mt-8">
            <h1 className="text-4xl italic font-semibold">
              ISLAMIC KNOWLEDGE STANDARDIZED TESTING
            </h1>
          </div>
        </div>
        
      </MaxWidthWrapper>
      <div className="bg-yellow-500 py-8">
      <div className="text-center">
        <h2 className="mb-4 font-bold text-3xl bg-black text-white px-6 py-2 inline-block">
          About IKST
        </h2>
      </div>
          <div className="flex flex-col gap-4 w-2/3 mx-auto text-center font-semibold">
            <p>
              IKST is a non-profit organization which aims to develop a standardize method of evaluating the Islamic knowledge of kids residing mostly in western countries where no specific nationwide standard exist for evaluation of the knowledge.
            </p>
            <p>
              By providing yearly evaluation, parents can evaluate areas of improvement required and institution can compare the performance of the school and staff against other institutions.
            </p>
            <p>
              Since the project is relatively new, there is a lot to learn, example can kids attending private full-time school and Alim Programs be evaluated against kids attending weekends programs only.
            </p>
            <p>
              InshaAllah with the help of community and scholars, we will continue to enhance features like, comparisons against only weekend school, full-time schools and schools that offer Alim Programs.
            </p>
          </div>
        </div>
    </div>
  );
}
