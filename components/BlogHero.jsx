export default function BlogHero({
  bannerImage,
  title,
  authorName,
  authorAvatar,
  wrapperStyle = {},
  isCard = false,
}) {
  return (
    <div
      className="w-full aspect-[1670/1300] sm:aspect-[1670/1098]"
      style={{
        position: "relative",
        containerType: "inline-size",
        filter: "drop-shadow(0px 0px 8px rgba(0,0,0,0.6))",
        ...wrapperStyle,
      }}
    >
      {/* Teal background card */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#0097A7",
          borderRadius: "24px",
          clipPath: "polygon(0% 0%, 100% 0%, 100% 80%, 86% 100%, 0% 100%)",
        }}
      />

      {/* White inner card */}
      <div
        style={{
          position: "absolute",
          left: "2.2%",
          top: "2.7%",
          right: "2.2%",
          bottom: "2.7%",
          backgroundColor: "white",
        
          clipPath: "polygon(0% 0%, 100% 0%, 100% 78%, 83% 100%, 0% 100%)",
          filter: "drop-shadow(0px 0px 12px rgba(0,0,0,0.85))",
        }}
      />

      {/* Banner Image */}
      <div
        style={{
          position: "absolute",
          left: "9.46%",
          top: "8.35%",
          width: "81.14%",
          height: "58.29%",
          borderRadius: "13.4076px",
          overflow: "hidden",
          border: "4px solid #FE7702",
          filter: "drop-shadow(0px 0px 12px rgba(0,0,0,0.85))",
        }}
      >
        <img
          src={bannerImage}
          alt="Blog banner"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>

      {/* Title */}
      <div
        style={{
          position: "absolute",
          left: "6.59%",
          top: "68.5%",
          width: "81.14%",
          padding: "0 3%",
        }}
      >
        {!isCard ? (
          <h2
            className="font-anton text-primary leading-tight"
            style={{ fontSize: "clamp(0.6rem, 2.8cqw, 2.8rem)" }}
          >
            {title}
          </h2>
        ) : (
          <h2
            className="font-anton text-primary leading-tight"
            style={{ fontSize: "clamp(0.9rem, 4.5cqw, 4rem)" }}
          >
            {title}
          </h2>
        )}
      </div>

      {/* Author */}
      <div
        style={{
          position: "absolute",
          left: "6.59%",
          top: "83%",
          width: "60%",
          display: "flex",
          alignItems: "center",
          gap: "2%",
          padding: "0 3%",
        }}
      >
        <img
          src={authorAvatar}
          alt={authorName}
          className="border-primary border-2"
          style={{
            width: "clamp(28px, 7cqw, 90px)",
            aspectRatio: "1/1",
            borderRadius: "50%",
            objectFit: "cover",
            flexShrink: 0,
            alignSelf: "center",
          }}
        />
        <span
          style={{
            fontFamily: "Poppins, sans-serif",
            color: "#333",
            fontSize: isCard
              ? "clamp(0.7rem, 3cqw, 2rem)"
              : "clamp(0.5rem, 2cqw, 1.6rem)",
            fontWeight: 600,
            lineHeight: 1.2,
            alignSelf: "center",
          }}
        >
          {authorName}
        </span>
      </div>
    </div>
  );
}
