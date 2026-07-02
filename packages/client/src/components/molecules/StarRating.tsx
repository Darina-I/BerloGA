import { StarIcon } from "../atoms/StarIcon";

interface StarRatingProps {
  rating?: number;
  readonly?: boolean;
  changeRating?: (newRaiting: number) => void;
}

const COUNT_STARS = 5;

export function StarRating({
  rating = 0,
  readonly = true,
  changeRating,
}: StarRatingProps) {
  const handleClick = (newRating: number) => {
    changeRating?.(newRating);
  };

  return (
    <div
      className={`flex items-center ${readonly ? "absolute bottom-1 gap-0.5 bg-third-color rounded-full px-1" : "gap-1"}`}
    >
      {[...Array(COUNT_STARS)].map((_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= rating;
        const colorClass =
          (isFilled ? "text-amber-500" : "text-gray-400") +
          (!readonly ? " hover:text-amber-500" : "");

        return (
          <button
            key={starValue}
            type="button"
            onClick={() => !readonly && handleClick(starValue)}
            aria-label={`${starValue} stars`}
            className="focus:outline-none cursor-pointer p-1 hover:scale-110 transition-transform"
          >
            <StarIcon
              className={`${readonly ? "w-4 h-4" : "w-8 h-8"} ${colorClass}`}
            />
          </button>
        );
      })}
      {!readonly && (
        <span className="ml-2 text-sm text-gray-500">{rating} / 5</span>
      )}
    </div>
  );
}
