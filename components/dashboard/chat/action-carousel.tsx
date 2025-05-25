import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import type { ChatAction } from "@/lib/types/chat";
import { usePortfolio } from "@/lib/contexts/portfolio-context";
import { buyAsset, sellAsset } from "@/lib/services/portfolio";
import { useToast } from "@/components/ui/use-toast";

interface ActionCarouselProps {
  actions: ChatAction[];
  onExecute?: (action: ChatAction, index: number) => void;
}

export function ActionCarousel({ actions, onExecute }: ActionCarouselProps) {
  const { selectedPortfolio, refreshAll } = usePortfolio();
  const [loadingIdx, setLoadingIdx] = useState<number | null>(null);
  const { toast } = useToast();

  const handleExecute = async (action: ChatAction, idx: number) => {
    if (!selectedPortfolio || action.executed) return;
    setLoadingIdx(idx);
    try {
      let result;
      if (action.type === "buy") {
        result = await buyAsset({
          portfolioId: selectedPortfolio.id,
          actionId: action.id,
          assetSymbol: action.assetSymbol!,
          investmentType: action.investmentType!,
          region: action.region!,
          quantity: Number(action.quantity),
        });
        let price = action.price;
        if (!price && result && result.transaction && result.transaction.price) {
          price = result.transaction.price;
        }
        toast({
          title: "Buy Successful",
          description: `Bought ${action.quantity} ${action.assetSymbol}`,
        });
      } else if (action.type === "sell") {
        result = await sellAsset({
          portfolioId: selectedPortfolio.id,
          actionId: action.id,
          assetSymbol: action.assetSymbol!,
          investmentType: action.investmentType!,
          region: action.region!,
          quantity: Number(action.quantity),
        });
        let price = action.price;
        if (!price && result && result.transaction && result.transaction.price) {
          price = result.transaction.price;
        }
        toast({
          title: "Sell Successful",
          description: `Sold ${action.quantity} ${action.assetSymbol}}`,
        });
      }
      onExecute?.(action, idx);
      await refreshAll?.();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Trade Failed",
        description: err?.message || "An error occurred. Please try again.",
      });
    } finally {
      setLoadingIdx(null);
    }
  };

  return (
    <Carousel opts={{ align: "start", slidesToScroll: 2 }} className="w-full max-w-xs md:max-w-md mx-auto">
      <CarouselContent>
        {actions.map((action, i) => {
          const executed = action.executed;
          return (
            <CarouselItem key={i} className="basis-1/2">
              <Card className={`border shadow-sm rounded-lg flex flex-col h-full transition-opacity duration-200 ${executed ? 'bg-zinc-900 text-zinc-400 opacity-60 pointer-events-none' : 'bg-background text-card-foreground'}` }>
                <CardContent className="p-4 pb-2 text-xs font-medium text-center flex-1 flex items-center justify-center">
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
                <CardFooter className="gap-2 pt-0 pb-3 px-3 flex flex-row w-full justify-center items-end">
                  <Button
                    size="sm"
                    variant="outline"
                    className={`h-8 px-4 flex items-center justify-center ${action.type === 'buy' ? 'border-green-500 text-green-600 hover:bg-green-500' : 'border-red-500 text-red-600 hover:bg-red-500'}`}
                    onClick={() => handleExecute(action, i)}
                    aria-label="Execute"
                    disabled={!!executed || loadingIdx === i}
                  >
                    {loadingIdx === i ? (
                      <span className="w-4 h-4 animate-spin border-2 border-current border-t-transparent rounded-full inline-block" />
                    ) : (
                      executed ? "Executed" : "Execute"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="-left-3 top-1/2 -translate-y-1/2" />
      <CarouselNext className="-right-3 top-1/2 -translate-y-1/2" />
    </Carousel>
  );
} 