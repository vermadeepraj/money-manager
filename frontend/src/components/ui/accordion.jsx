/**
 * Accordion components - HeroUI wrapper
 * New component for HeroUI migration
 */
import { Accordion as HeroAccordion, AccordionItem as HeroAccordionItem } from "@heroui/react"
import { cn } from "../../lib/utils"

/**
 * Accordion - HeroUI-based accordion component
 * 
 * @example
 * <Accordion>
 *   <AccordionItem key="1" title="Question 1">
 *     Answer 1
 *   </AccordionItem>
 *   <AccordionItem key="2" title="Question 2">
 *     Answer 2
 *   </AccordionItem>
 * </Accordion>
 */
const Accordion = ({
    children,
    variant = "light", // light, bordered, shadow, splitted
    selectionMode = "single", // single, multiple
    selectedKeys,
    defaultSelectedKeys,
    onSelectionChange,
    isCompact = false,
    isDisabled = false,
    showDivider = true,
    hideIndicator = false,
    disableAnimation = false,
    disableIndicatorAnimation = false,
    itemClasses = {},
    classNames = {},
    className,
    ...props
}) => {
    return (
        <HeroAccordion
            variant={variant}
            selectionMode={selectionMode}
            selectedKeys={selectedKeys}
            defaultSelectedKeys={defaultSelectedKeys}
            onSelectionChange={onSelectionChange}
            isCompact={isCompact}
            isDisabled={isDisabled}
            showDivider={showDivider}
            hideIndicator={hideIndicator}
            disableAnimation={disableAnimation}
            disableIndicatorAnimation={disableIndicatorAnimation}
            itemClasses={{
                base: cn("", itemClasses.base),
                heading: cn("", itemClasses.heading),
                trigger: cn(
                    "px-5 py-4 bg-default-100 hover:bg-default-200 data-[open=true]:bg-default-200 rounded-xl",
                    itemClasses.trigger
                ),
                titleWrapper: cn("", itemClasses.titleWrapper),
                title: cn("text-foreground font-medium", itemClasses.title),
                subtitle: cn("text-muted-foreground", itemClasses.subtitle),
                startContent: cn("", itemClasses.startContent),
                indicator: cn("text-muted-foreground", itemClasses.indicator),
                content: cn("text-muted-foreground px-5 pb-4", itemClasses.content),
                ...itemClasses,
            }}
            className={cn("gap-3", className)}
            {...props}
        >
            {children}
        </HeroAccordion>
    )
}

/**
 * AccordionItem - Individual accordion item
 */
const AccordionItem = ({
    children,
    title,
    subtitle,
    startContent,
    indicator,
    isCompact = false,
    isDisabled = false,
    hideIndicator = false,
    disableAnimation = false,
    disableIndicatorAnimation = false,
    classNames = {},
    className,
    ...props
}) => {
    return (
        <HeroAccordionItem
            title={title}
            subtitle={subtitle}
            startContent={startContent}
            indicator={indicator}
            isCompact={isCompact}
            isDisabled={isDisabled}
            hideIndicator={hideIndicator}
            disableAnimation={disableAnimation}
            disableIndicatorAnimation={disableIndicatorAnimation}
            classNames={{
                base: cn("", classNames.base),
                heading: cn("", classNames.heading),
                trigger: cn("", classNames.trigger),
                titleWrapper: cn("", classNames.titleWrapper),
                title: cn("", classNames.title),
                subtitle: cn("", classNames.subtitle),
                startContent: cn("", classNames.startContent),
                indicator: cn("", classNames.indicator),
                content: cn("", classNames.content),
                ...classNames,
            }}
            className={className}
            {...props}
        >
            {children}
        </HeroAccordionItem>
    )
}

export { Accordion, AccordionItem, HeroAccordion, HeroAccordionItem }
