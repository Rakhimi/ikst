
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <MaxWidthWrapper>
        <div className="my-10">
          <div className="text-center">
          <h1
          className="text-6xl italic font-semibold"
          >
          ISLAMIC KNOWLEDGE STANDARDIZED TESTING
          </h1>
          </div>
          <div className="flex gap-4 items-start mt-10">
          <Image
            src="/home.jpg"
            alt="Home Image"
            width={500}
            height={300}
          />
          <div>
          <div className="flex flex-col gap-2">
            <h2 className="font-bold">About Us</h2>
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
          <div className="flex flex-col gap-2 mt-4">
            <h2 className="font-bold">Advisors and Authors</h2>
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
          
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
