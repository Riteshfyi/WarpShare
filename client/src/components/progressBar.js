export default function ProgressBar({ progress }) {
  return (
    <div className="w-full bg-gray-700 rounded-full h-2.5 dark:bg-gray-700 mt-2">
      <div
        className="bg-blue-600 h-2.5 rounded-full"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
