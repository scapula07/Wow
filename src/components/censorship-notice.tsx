import { AlertCircle, Mail, X } from "lucide-react";
import type { CensoredStreamInfo } from "@/firebase/censorship";
import { formatBlockReason } from "@/firebase/censorship";
import { useState } from "react";

interface CensorshipNoticeProps {
  censoredStreams: CensoredStreamInfo[];
}

export const CensorshipNotice = ({ censoredStreams }: CensorshipNoticeProps) => {
  const [isVisible, setIsVisible] = useState(true);

  if (censoredStreams.length === 0 || !isVisible) return null;

  const totalCount = censoredStreams.length;
  const totalBlocks = censoredStreams.reduce(
    (sum, stream) => sum + stream.censorshipCount,
    0
  );

  // Get unique reasons from all censored streams
  const allReasons = new Set<string>();
  censoredStreams.forEach((stream) => {
    stream.reasons.forEach((reason) => allReasons.add(reason));
  });

  const topReasons = Array.from(allReasons).slice(0, 3);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-900/95 backdrop-blur-sm border-b-2 border-red-600/50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex items-start gap-3 sm:gap-4">
          <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7 text-red-300 flex-shrink-0 mt-1" />
          
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-red-200 font-bold text-base sm:text-lg mb-2">
                Content Moderation Notice
              </h3>
              <p className="text-gray-200 text-xs sm:text-sm">
                {totalCount === 1 ? (
                  <>
                    <span className="font-semibold">{totalCount} stream</span> from this user has been hidden by our community
                  </>
                ) : (
                  <>
                    <span className="font-semibold">{totalCount} streams</span> from this user have been hidden by our community
                  </>
                )}
                {" "}due to receiving <span className="font-semibold">{totalBlocks} reports</span> from multiple viewers.
              </p>
            </div>

            {topReasons.length > 0 && (
              <div>
                <p className="text-gray-300 text-xs font-semibold mb-2">
                  Primary Reasons:
                </p>
                <div className="flex flex-wrap gap-2">
                  {topReasons.map((reason, index) => (
                    <span
                      key={index}
                      className="bg-red-800/60 text-red-100 text-[10px] px-3 py-1 rounded-full border border-red-500/40 font-normal"
                    >
                      {formatBlockReason(reason)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-black/40 rounded-lg p-3 mt-3">
              <div className="flex items-start gap-2 sm:gap-3">
                <Mail className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-200 text-xs sm:text-sm">
                    Contact our moderation team:
                  </p>
                  <a
                    href="mailto:support@wowlive.com"
                    className="text-red-200 hover:text-red-100 font-semibold text-xs sm:text-sm mt-1 inline-block underline"
                  >
                    support@wowlive.com
                  </a>
                </div>
              </div>
            </div>

            {totalCount > 1 && (
              <details className="text-xs sm:text-sm text-gray-300 mt-2">
                <summary className="cursor-pointer hover:text-gray-200 font-semibold">
                  View affected streams ({totalCount})
                </summary>
                <ul className="mt-2 space-y-1 ml-4 list-disc">
                  {censoredStreams.map((stream) => (
                    <li key={stream.streamId}>
                      <a
                        href={`/streams/${stream.streamId}`}
                        className="text-red-200 hover:text-red-100 underline hover:no-underline transition-colors"
                      >
                        {stream.streamName}
                      </a>
                      <span className="text-gray-400 text-xs ml-2">
                        ({stream.censorshipCount} reports)
                      </span>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 p-1.5 hover:bg-red-800/50 rounded-full transition-colors"
            aria-label="Close notice"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-red-200 hover:text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
