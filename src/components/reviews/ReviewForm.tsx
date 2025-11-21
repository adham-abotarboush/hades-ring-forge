import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RatingStars } from "./RatingStars";
import { toast } from "sonner";

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  review_text: z
    .string()
    .min(10, "Review must be at least 10 characters")
    .max(500, "Review must be less than 500 characters"),
});

interface ReviewFormProps {
  productHandle: string;
  userId: string;
  existingReview?: {
    id: string;
    rating: number;
    review_text: string;
  };
  onSuccess: () => void;
  onCancel?: () => void;
}

export function ReviewForm({
  productHandle,
  userId,
  existingReview,
  onSuccess,
  onCancel,
}: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: existingReview?.rating || 0,
      review_text: existingReview?.review_text || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof reviewSchema>) => {
    setIsSubmitting(true);

    try {
      if (existingReview) {
        const { error } = await supabase
          .from("reviews")
          .update({
            rating: values.rating,
            review_text: values.review_text,
          })
          .eq("id", existingReview.id);

        if (error) throw error;
        toast.success("Review updated successfully!");
      } else {
        const { error } = await supabase.from("reviews").insert({
          user_id: userId,
          product_handle: productHandle,
          rating: values.rating,
          review_text: values.review_text,
        });

        if (error) {
          if (error.code === "23505") {
            toast.error("You've already reviewed this product");
          } else {
            throw error;
          }
          return;
        }
        toast.success("Review submitted successfully!");
      }

      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <RatingStars
                  rating={field.value}
                  interactive
                  onRatingChange={field.onChange}
                  size="lg"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="review_text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Review</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your thoughts about this product..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-muted-foreground">
                {field.value.length}/500 characters
              </p>
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Submitting..."
              : existingReview
              ? "Update Review"
              : "Submit Review"}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
