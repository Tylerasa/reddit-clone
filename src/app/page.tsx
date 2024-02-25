import { unstable_noStore as noStore } from "next/cache";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { SingleFeedPost } from "./_components/Posts/SingleFeedPost";
import person from "assets/images/person.png";
import Image from "next/image";
import CheckAuthStatusFeed from "./_components/CheckAuthStatuFeed";

export default async function Home() {
  noStore();

  return (
    <main className="feed h-screen w-screen overflow-y-auto pb-10">
      <div className=" w-[37.5rem]">
          <CheckAuthStatusFeed/>
        <SingleFeedPost />
        <SingleFeedPost />
        <SingleFeedPost />
        <SingleFeedPost />
        <SingleFeedPost />
        <SingleFeedPost />
        <SingleFeedPost />
        <SingleFeedPost />
        <SingleFeedPost />
        <SingleFeedPost />
        <SingleFeedPost />
        <SingleFeedPost />
        <SingleFeedPost />
        <SingleFeedPost />
      </div>
    </main>
  );
}
