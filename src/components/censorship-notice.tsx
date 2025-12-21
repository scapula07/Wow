import { AlertCircle, Mail } from "lucide-react";
import type { CensoredStreamInfo } from "@/firebase/censorship";
import { formatBlockReason } from "@/firebase/censorship";

interface CensorshipNoticeProps {
  censoredStreams: CensoredStreamInfo[];
}

export const CensorshipNotice = ({ censoredStreams }: CensorshipNoticeProps) => {
  if (censoredStreams.length === 0) return null;

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
    <div className="bg-red-900/20 border-2 border-red-600/50 rounded-lg p-4 sm:p-6 mb-6">
      <div className="flex items-start gap-3 sm:gap-4">
        <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 flex-shrink-0 mt-1" />
        
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-red-500 font-bold text-lg sm:text-xl mb-2">
              Content Moderation Notice
            </h3>
            <p className="text-gray-300 text-sm sm:text-base">
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
              <p className="text-gray-400 text-xs sm:text-sm font-semibold mb-2">
                Primary Reasons:
              </p>
              <div className="flex flex-wrap gap-2">
                {topReasons.map((reason, index) => (
                  <span
                    key={index}
                    className="bg-red-900/40 text-red-300 text-xs px-3 py-1 rounded-full border border-red-600/30"
                  >
                    {formatBlockReason(reason)}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="bg-black/30 rounded-lg p-3 sm:p-4 mt-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <Mail className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-300 text-sm">
                  If you believe this action was taken in error, please contact our moderation team:
                </p>
                <a
                  href="mailto:support@wowlive.com"
                  className="text-primary hover:text-primary/80 font-semibold text-sm mt-1 inline-block"
                >
                  support@wowlive.com
                </a>
              </div>
            </div>
          </div>

          {totalCount > 1 && (
            <details className="text-sm text-gray-400 mt-3">
              <summary className="cursor-pointer hover:text-gray-300 font-semibold">
                View affected streams ({totalCount})
              </summary>
              <ul className="mt-2 space-y-1 ml-4 list-disc">
                {censoredStreams.map((stream) => (
                  <li key={stream.streamId}>
                    <span className="text-gray-300">{stream.streamName}</span>
                    <span className="text-gray-500 text-xs ml-2">
                      ({stream.censorshipCount} reports)
                    </span>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      </div>
    </div>
  );
};
