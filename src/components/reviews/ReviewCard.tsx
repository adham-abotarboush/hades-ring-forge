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
    user_id: string;
    profiles?: {
      full_name: string | null;
    };
  };
  currentUserId?: string;
  onEdit?: (reviewId: string) => void;
  onDelete?: (reviewId: string) => void;
}

export function ReviewCard({ review, currentUserId, onEdit, onDelete }: ReviewCardProps) {
  const isOwnReview = currentUserId === review.user_id;
  const reviewerName = review.profiles?.full_name || "Anonymous";

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <RatingStars rating={review.rating} size="sm" />
            <span className="text-sm font-medium">{reviewerName}</span>
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
