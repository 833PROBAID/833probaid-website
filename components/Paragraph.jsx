export default function Paragraph({ children }) {
  return (
    <p className="font-montserrat text-center text-lg font-bold md:text-xl lg:text-2xl xl:text-3xl">
      {children}
    </p>
  );
}
