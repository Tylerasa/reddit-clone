import { unstable_noStore as noStore } from "next/cache";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import person from "assets/images/person.png";
import Image from "next/image";
import { RouterOutputs } from "~/trpc/shared";
import CheckAuthStatusFeed from "../_components/CheckAuthStatuFeed";
import MyFeed from "../_components/MyPosts/MyFeed";
import { CreatePost, CreatePostSkeleton } from "../_components/Posts/CreatePost";

export default async function Home() {
  noStore();

  return (
    <main className="feed h-screen w-screen overflow-y-auto pb-10">
      <div className="w-[37.5rem]">
        <CheckAuthStatusFeed/>
        <MyFeed />
      </div>
    </main>
  );
}
