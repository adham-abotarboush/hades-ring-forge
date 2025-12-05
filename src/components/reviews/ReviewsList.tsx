import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ReviewCard } from "./ReviewCard";
import { ReviewForm } from "./ReviewForm";
import { RatingStars } from "./RatingStars";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface Review {
  id: string;
  rating: number;
  review_text: string;
  created_at: string;
  reviewer_name: string;
  is_own_review: boolean;
}

interface ReviewsListProps {
  productHandle: string;
}

export function ReviewsList({ productHandle }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
    checkUser();
  }, [productHandle]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchReviews = async () => {
    setIsLoading(true);
    // Use the public_reviews view which hides user_id and exposes is_own_review
    const { data, error } = await supabase
      .from("public_reviews" as any)
      .select("id, product_handle, rating, review_text, created_at, updated_at, reviewer_name, is_own_review")
      .eq("product_handle", productHandle)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } else {
      setReviews((data as unknown as Review[]) || []);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteReviewId) return;

    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", deleteReviewId);

    if (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    } else {
      toast.success("Review deleted successfully");
      fetchReviews();
    }
    setDeleteReviewId(null);
  };

  const userReview = reviews.find((r) => r.is_own_review);
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <RatingStars rating={Math.round(averageRating)} size="md" />
              <span className="text-sm text-muted-foreground">
                {averageRating.toFixed(1)} out of 5 ({reviews.length}{" "}
                {reviews.length === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}
        </div>

        {user && !userReview && !showForm && (
          <Button onClick={() => setShowForm(true)}>Write a Review</Button>
        )}
      </div>

      {user && (showForm || editingReview) && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">
            {editingReview ? "Edit Your Review" : "Write a Review"}
          </h3>
          <ReviewForm
            productHandle={productHandle}
            userId={user.id}
            existingReview={
              editingReview
                ? {
                    id: editingReview.id,
                    rating: editingReview.rating,
                    review_text: editingReview.review_text,
                  }
                : undefined
            }
            onSuccess={() => {
              setShowForm(false);
              setEditingReview(null);
              fetchReviews();
            }}
            onCancel={() => {
              setShowForm(false);
              setEditingReview(null);
            }}
          />
        </Card>
      )}

      {!user && !reviews.length && (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">
            No reviews yet. Be the first to review this product!
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Please <a href="/auth" className="text-primary underline">login</a> to write a review.
          </p>
        </Card>
      )}

      {!user && reviews.length > 0 && (
        <Card className="p-4 bg-muted/50">
          <p className="text-sm text-center">
            <a href="/auth" className="text-primary underline">Login</a> to write a review
          </p>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading reviews...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={{
                id: review.id,
                rating: review.rating,
                review_text: review.review_text,
                created_at: review.created_at,
                reviewer_name: review.reviewer_name,
              }}
              isOwnReview={review.is_own_review}
              onEdit={() => setEditingReview(review)}
              onDelete={(id) => setDeleteReviewId(id)}
            />
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteReviewId} onOpenChange={() => setDeleteReviewId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
