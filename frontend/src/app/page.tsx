import Hero from "@/components/sections/Hero";
import Marquee from "@/components/ui/Marquee";
import About from "@/components/sections/About";
import Process from "@/components/sections/Process";
import Services from "@/components/sections/Services";
import WhyUs from "@/components/sections/WhyUs";
import Faq from "@/components/sections/Faq";
import Contacts from "@/components/sections/Contacts";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Hero />
      <Marquee />
      <About />
      <Process />
      <Services />
      <WhyUs />
      <Faq />
      <Contacts />
    </div>
  );
}
