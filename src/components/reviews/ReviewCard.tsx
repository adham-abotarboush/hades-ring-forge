import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { RatingStars } from "./RatingStars";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    review_text: string;
    created_at: string;
    reviewer_name: string;
  };
  isOwnReview?: boolean;
  onEdit?: (reviewId: string) => void;
  onDelete?: (reviewId: string) => void;
}

export function ReviewCard({ review, isOwnReview, onEdit, onDelete }: ReviewCardProps) {
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <RatingStars rating={review.rating} size="sm" />
            <span className="text-sm font-medium">{review.reviewer_name}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {format(new Date(review.created_at), "MMM d, yyyy")}
          </p>
        </div>
        {isOwnReview && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit?.(review.id)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete?.(review.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
      <p className="text-sm text-foreground">{review.review_text}</p>
    </Card>
  );
}
