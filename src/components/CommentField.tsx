import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { CreateCommentInput } from "src/schema/comment.schema";
import { trpc } from "@utils/trpc";
import { useRouter } from "next/router";

type Props = {
  parentId?: string;
};

const CommentField: React.FC<Props> = ({ parentId }) => {
  const { handleSubmit, reset, register } = useForm<CreateCommentInput>({
    defaultValues: {
      body: undefined,
    },
  });

  const router = useRouter();
  const postId = router.query.postId as string;
  const utils = trpc.useContext();

  const { mutate, isLoading, error } = trpc.useMutation(
    ["comments.add-comment"],
    {
      onSuccess: () => {
        reset();

        // This will refetch the comments.
        utils.invalidateQueries([
          "comments.all-comments",
          {
            postId,
          },
        ]);
      },
    }
  );

  const onSubmit = useCallback(
    (values: CreateCommentInput) => {
      const payload = {
        ...values,
        postId,
        parentId,
      };

      mutate(payload);
    },
    [mutate, parentId, postId]
  );

  return (
    <div className="mt-6">
      <h2 className="text-lg font-medium">Comments</h2>

      {error && error.message}

      <form onSubmit={handleSubmit(onSubmit)}>
        <textarea
          className="bg-slate-100 p-3 w-full mt-2 shadow-md dark:bg-zinc-900"
          defaultValue={undefined}
          {...register("body")}
          placeholder={parentId ? "Post reply" : "Post comment"}
        />
        <div className="flex w-full justify-between">
          <button
            className="px-5 py-2 mt-2 bg-emerald-500 text-white"
            type="submit"
            disabled={isLoading}
          >
            Send comment
          </button>

          {!parentId && (
            <p className="prose">
              supports{" "}
              <a
                className="text-emerald-500"
                href="https://www.markdownguide.org/basic-syntax/"
                target="_blank"
                rel="noreferrer"
              >
                markdown
              </a>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default CommentField;