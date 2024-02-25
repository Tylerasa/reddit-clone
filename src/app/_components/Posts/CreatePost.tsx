import Image from "next/image";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import person from "assets/images/person.png";


export const CreatePost = () => {
    return (
      <div className="shadow-card-shadow flex w-full gap-4 rounded-xl border  border-gray-200 bg-white px-3 py-4">
        <Image src={person} alt="picture of an person" className="h-6 w-6" />
        <div className="w-full">
          <div className="flex w-full flex-col gap-3 border-b border-b-gray-200 pb-3">
            <Input
              placeholder="Title of your post"
              className="h-6 w-full border-none font-medium p-0 placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Input
              placeholder="Share your thoughts with the world!"
              className="h-6 w-full border-none p-0 placeholder:text-gray-500  focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="flex justify-end pt-3">
            <Button className="bg-indigo-500 hover:bg-indigo-600">Post</Button>
          </div>
        </div>
      </div>
    );
  };
  