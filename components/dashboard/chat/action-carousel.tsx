import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Check, X } from "lucide-react";
import type { ChatAction } from "@/lib/types/chat";

interface ActionCarouselProps {
  actions: ChatAction[];
  onExecute: (action: ChatAction) => void;
  onDeny: (action: ChatAction) => void;
}

export function ActionCarousel({ actions, onExecute, onDeny }: ActionCarouselProps) {
  return (
    <Carousel opts={{ align: "start", slidesToScroll: 2 }} className="w-full max-w-xs md:max-w-md mx-auto">
      <CarouselContent>
        {actions.map((action, i) => (
          <CarouselItem key={i} className="basis-1/2">
            <Card className="border bg-background shadow-sm rounded-lg flex flex-col h-full">
              <CardContent className="p-4 pb-2 text-xs font-medium text-card-foreground text-center flex-1 flex items-center justify-center">
                {action.type === "buy" && (
                  <span>
                    Buy <span className="font-bold">{action.quantity}</span> of <span className="font-bold">{action.assetSymbol}</span> ({action.investmentType})
                    {action.region && action.region !== "Global" && (
                      <> in <span className="font-bold">{action.region}</span></>
                    )}
                  </span>
                )}
                {action.type === "sell" && (
                  <span>
                    Sell <span className="font-bold">{action.quantity}</span> of <span className="font-bold">{action.assetSymbol}</span> ({action.investmentType})
                    {action.region && action.region !== "Global" && (
                      <> in <span className="font-bold">{action.region}</span></>
                    )}
                  </span>
                )}
                {action.type !== "buy" && action.type !== "sell" && (
                  <span>{action.type}</span>
                )}
              </CardContent>
              <CardFooter className="gap-2 pt-0 pb-3 px-3 flex flex-row w-full justify-between items-end">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 p-0 flex items-center justify-center hover:bg-green-100 hover:border-green-400"
                  onClick={() => onExecute(action)}
                  aria-label="Execute"
                >
                  <Check className="w-4 h-4 text-green-600" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 p-0 flex items-center justify-center hover:bg-red-100 hover:border-red-400"
                  onClick={() => onDeny(action)}
                  aria-label="Deny"
                >
                  <X className="w-4 h-4 text-red-600" />
                </Button>
              </CardFooter>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="-left-3 top-1/2 -translate-y-1/2" />
      <CarouselNext className="-right-3 top-1/2 -translate-y-1/2" />
    </Carousel>
  );
} 