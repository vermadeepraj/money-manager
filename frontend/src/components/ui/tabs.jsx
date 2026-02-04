/**
 * Tabs components - HeroUI wrapper
 * New component for HeroUI migration
 */
import { Tabs as HeroTabs, Tab as HeroTab } from "@heroui/react"
import { cn } from "../../lib/utils"

/**
 * Tabs - HeroUI-based tabs component
 * 
 * @example
 * <Tabs 
 *   selectedKey={activeTab} 
 *   onSelectionChange={setActiveTab}
 *   variant="underlined"
 * >
 *   <Tab key="expense" title="Expense">
 *     <ExpenseContent />
 *   </Tab>
 *   <Tab key="income" title="Income">
 *     <IncomeContent />
 *   </Tab>
 * </Tabs>
 */
const Tabs = ({
    children,
    selectedKey,
    onSelectionChange,
    variant = "solid", // solid, bordered, light, underlined
    color = "primary",
    size = "md",
    radius = "md",
    fullWidth = false,
    isDisabled = false,
    disableAnimation = false,
    classNames = {},
    className,
    ...props
}) => {
    return (
        <HeroTabs
            selectedKey={selectedKey}
            onSelectionChange={onSelectionChange}
            variant={variant}
            color={color}
            size={size}
            radius={radius}
            fullWidth={fullWidth}
            isDisabled={isDisabled}
            disableAnimation={disableAnimation}
            classNames={{
                base: cn("", classNames.base),
                tabList: cn(
                    "bg-default-100 backdrop-blur-sm border border-border rounded-xl",
                    classNames.tabList
                ),
                cursor: cn("bg-accent rounded-lg", classNames.cursor),
                tab: cn(
                    "text-muted-foreground data-[selected=true]:text-foreground rounded-lg",
                    classNames.tab
                ),
                tabContent: cn("", classNames.tabContent),
                panel: cn("pt-4", classNames.panel),
                ...classNames,
            }}
            className={className}
            {...props}
        >
            {children}
        </HeroTabs>
    )
}

/**
 * Tab - Individual tab item
 */
const Tab = ({
    children,
    title,
    key,
    isDisabled = false,
    className,
    ...props
}) => {
    return (
        <HeroTab
            key={key}
            title={title}
            isDisabled={isDisabled}
            className={className}
            {...props}
        >
            {children}
        </HeroTab>
    )
}

export { Tabs, Tab, HeroTabs, HeroTab }
