"use client";
import { useEffect, useState } from "react";
import { type IPaper } from "@/interface";
import Image from "next/image";
import { Eye, Download, Check } from "lucide-react";
import {
  capsule,
  extractBracketContent,
  extractWithoutBracketContent,
} from "@/util/utils";
import axios from "axios";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CardProps {
  paper: IPaper;
  onSelect: (paper: IPaper, isSelected: boolean) => void;
  isSelected: boolean;
}

const Card = ({ paper, onSelect, isSelected }: CardProps) => {
  const [checked, setChecked] = useState<boolean>(isSelected);

  useEffect(() => {
    setChecked(isSelected);
  }, [isSelected]);

  const getSecureUrl = (url: string): string =>
    url.startsWith("http://") ? url.replace("http://", "https://") : url;

  const generateFileName = (paper: IPaper): string => {
    const extension = paper.finalUrl.split(".").pop();
    return `${extractBracketContent(paper.subject)}-${paper.exam}-${paper.slot}-${paper.year}.${extension}`;
  };

  const downloadFile = async (url: string, filename: string): Promise<void> => {
    try {
      const response = await axios.get(url, { responseType: "blob" });
      const blob = new Blob([response.data]);
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleDownload = async (paper: IPaper) => {
    await downloadFile(getSecureUrl(paper.finalUrl), generateFileName(paper));
  };

  const handleCheckboxChange = () => {
    setChecked((prev) => {
      const newChecked = !prev;
      onSelect(paper, newChecked);
      return newChecked;
    });
  };

  const paperLink = `/paper/${paper._id}`;

  return (
    <div
      className={cn(
        "play overflow-hidden rounded-sm border-2 border-[#734DFF] bg-[#FFFFFF] hover:bg-[#EFEAFF] dark:border-[#36266D] dark:bg-[#171720] hover:dark:bg-[#262635]",
        checked && "bg-[#262635]",
      )}
    >
      <Link href={paperLink} target="_blank" rel="noopener noreferrer">
        <Image
          src={paper.thumbnailUrl}
          alt={paper.subject}
          width={320}
          height={180}

          className="h-[160px] w-full object-cover p-4 pb-3 md:h-[250px]"
        />

        <div className="justify-center">
          <div className="flex flex-row items-center justify-between px-4 pb-2">
            <div className="font-sans text-sm font-medium">
              {extractBracketContent(paper.subject)}
            </div>
            <div className="flex gap-2">
              <Link href={paperLink} target="_blank" rel="noopener noreferrer">
                <Eye size={22} />
              </Link>
              <Download size={20} onClick={() => handleDownload(paper)} />
            </div>
          </div>

          <div className="h-[1px] w-full bg-[#734DFF] dark:bg-[#36266D]" />

          <div className="space-y-2 p-4">
            <div className="font-sans text-base font-semibold">
              {extractWithoutBracketContent(paper.subject)}
            </div>
            <div className="flex flex-wrap gap-2">
              {capsule(paper.exam)}
              {capsule(paper.slot)}
              {capsule(paper.year)}
              {capsule(paper.semester)}
            </div>
          </div>
        </div>
      </Link>

      <div className="play hidden items-center justify-between gap-2 px-4 pb-4 md:flex">
        <div className="flex items-center gap-2">
          <input
            checked={checked}
            onChange={handleCheckboxChange}
            className="h-5 w-5 accent-[#7480FF]"
            type="checkbox"
          />
          <p>Select</p>
        </div>
        {paper.answerKeyIncluded && (
          <div className="flex items-center gap-2 font-normal text-[#7480FF]">
            <Check color="#7480FF" />
            Answer Key
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
