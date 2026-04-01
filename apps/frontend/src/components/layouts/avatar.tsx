function getAvatarColors(name: string) {
  const colors = ['#818cf8', '#f472b6', '#34d399', '#fbbf24', '#fb923c', '#a78bfa'];
  const index = name.charCodeAt(0) % colors.length;

  return {
    start: colors[index],
    end: colors[(index + 2) % colors.length],
  };
}

export function Avatar({
  name,
  image,
  size = 32,
}: {
  name: string;
  image?: string | null;
  size?: number;
}) {
  const colors = getAvatarColors(name);

  return (
    <div
      className="font-dm border-foreground/10 flex shrink-0 items-center justify-center rounded-full border font-medium text-white"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `linear-gradient(135deg, ${colors.start}, ${colors.end})`,
      }}
    >
      {image ? (
        <img
          src={image}
          alt={name}
          className="h-full w-full rounded-full object-cover"
          width={size}
          height={size}
        />
      ) : (
        name
          .split(' ')
          .map((part) => part[0])
          .join('')
          .slice(0, 2)
      )}
    </div>
  );
}
