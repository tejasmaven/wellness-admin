type Props = {
  checked: boolean;
  onChange: () => void;
};

export default function Toggle({ checked, onChange }: Props) {
  return (
    <button
      onClick={onChange}
      className={`w-12 h-6 flex items-center rounded-full p-1
        ${checked ? "bg-green-500" : "bg-gray-300"}`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow transform transition
          ${checked ? "translate-x-6" : ""}`}
      />
    </button>
  );
}
