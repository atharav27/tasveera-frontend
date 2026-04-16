import type { ReactNode } from "react";

import { Button } from "../../components/button";
import { Card, CardContent } from "../../components/card";

interface ActionCardProps {
  // Simple text pattern
  text?: string;
  // Title + description pattern
  title?: string;
  description?: string;
  // Button props
  buttonLabel: string;
  onClick?: () => void;
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
  buttonClassName?: string;
  icon?: ReactNode;
}

export function ActionCard({
  text,
  title,
  description,
  buttonLabel,
  onClick,
  buttonVariant = "default",
  buttonClassName,
  icon,
}: ActionCardProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className={`flex items-center justify-between ${title || description ? "py-1 px-6" : ""}`}>
        {text ? (
          <p className="text-sm font-medium text-slate-700">{text}</p>
        ) : (
          <div className="flex-1 max-w-[60%]" >
            {title && <h3 className="text-base font-medium text-slate-900 mb-2">{title}</h3>}
            {description && <p className="text-sm text-slate-600">{description}</p>}
          </div>
        )}
        <Button
          type="button"
          variant={buttonVariant}
          onClick={onClick}
          className={buttonClassName}
        >
          {icon}
          {buttonLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
