import Image from "next/image";

export default function LogoCard() {
  return (
    <div className="flex w-full justify-center">
      <div className="w-full" style={{ position: "relative", aspectRatio: "566/586" }}>

        {/* Outer teal card with shadow */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#0097A7",
          borderRadius: "22px",
          boxShadow: "0px 1.2px 15px rgba(0,0,0,0.99), 6px -6px 8px rgba(0,0,0,0.3) inset, -1.2px 7.2px 5px rgba(255,255,255,0.3) inset",
        }} />

        {/* Inner teal gradient layer */}
        <div style={{
          position: "absolute",
          left: "8%",
          top: "7%",
          right: "1.5%",
          bottom: "1.5%",
          background: "linear-gradient(135deg, #28AEB5 0%, #127E84 100%)",
          boxShadow: "-3.6px 5.4px 22px rgba(0,0,0,0.99)",
        }} />

        {/* Second teal layer */}
        <div style={{
          position: "absolute",
          left: "8%",
          top: "7%",
          right: "1.5%",
          bottom: "1.5%",
          backgroundColor: "#0097A7",
          boxShadow: "3.6px -2.4px 22px rgba(0,0,0,0.99), 10.8px -6px 5px rgba(0,0,0,0.3)",
        }} />

        {/* Orange left accent bar */}
        <div style={{
          position: "absolute",
          left: "8%",
          top: "16.8%",
          width: "4%",
          bottom: "1.5%",
          backgroundColor: "#FE7702",
        }} />

        {/* White inner card */}
        <div style={{
          position: "absolute",
          left: "12.2%",
          top: "7.3%",
          right: "4%",
          bottom: "6.5%",
          backgroundColor: "white",
          clipPath: "polygon(10% 0%, 100% 0%, 100% 78%, 90% 100%, 0% 100%, 0% 10%)",
          boxShadow: "1.22px 15.2px 16px rgba(0,0,0,0.816), 14.4px 0px 14px rgba(0,0,0,0.6)",
        }} />

        {/* Content */}
        <div style={{
          position: "absolute",
          left: "15%",
          top: "10%",
          right: "6%",
          bottom: "8%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <Image
            src="/images/footer-logo.png"
            alt="Footer logo"
            width={1000}
            height={1000}
            className="h-[111px] w-full object-contain px-6"
          />
          <p className="text-left font-bold mt-6 font-montserrat text-[#2A2A2A] pl-8 text-[19px] leading-tight">
            Expert Probate, Conservatorship, and Trust Real Estate Services
            handled personally from start to finish. Trusted by attorneys.
            Relied on by families. Built to keep the process moving, even
            when things get complicated
          </p>
        </div>

      </div>
    </div>
  );
}
