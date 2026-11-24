// CAPS stay as written; the lowercase connectors are set in italic.
export default function Words({ parts }: { parts: readonly string[] }) {
  return (
    <>
      {parts.map((p, i) => (
        <span key={i}>
          {i > 0 && " "}
          {p === p.toUpperCase() ? p : <em>{p}</em>}
        </span>
      ))}
    </>
  );
}
