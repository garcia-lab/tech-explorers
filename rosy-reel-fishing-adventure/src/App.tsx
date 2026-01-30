import { useState, useEffect, useRef, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Fish, Coins, ShoppingBag } from '@phosphor-icons/react'
import { toast, Toaster } from 'sonner'

interface BaitType {
  id: string
  name: string
  price: number
  size: number
  catchRate: number
}

interface FishType {
  id: string
  x: number
  y: number
  size: 'small' | 'large'
  color: string
  speed: number
  direction: number
}

type FishingTool = 'rod' | 'spear'

type EnvironmentType = 'beach' | 'lake' | 'arctic' | 'tropical' | 'sunset' | 'night'

interface Environment {
  id: EnvironmentType
  name: string
  emoji: string
  sky: { from: string; to: string }
  land: { from: string; via: string; to: string }
  water: { from: string; via: string; to: string }
  sunColor: string
  hasMoon?: boolean
  hasStars?: boolean
}

const environments: Environment[] = [
  {
    id: 'beach',
    name: 'Sunny Beach',
    emoji: '🏖️',
    sky: { from: '#e0f2fe', to: '#bae6fd' },
    land: { from: '#fde68a', via: '#fcd34d', to: '#f59e0b' },
    water: { from: '#7dd3fc', via: '#38bdf8', to: '#0369a1' },
    sunColor: '#fbbf24'
  },
  {
    id: 'lake',
    name: 'Forest Lake',
    emoji: '🌲',
    sky: { from: '#d1fae5', to: '#a7f3d0' },
    land: { from: '#86efac', via: '#4ade80', to: '#16a34a' },
    water: { from: '#67e8f9', via: '#22d3ee', to: '#0891b2' },
    sunColor: '#fcd34d'
  },
  {
    id: 'arctic',
    name: 'Arctic Ice',
    emoji: '🧊',
    sky: { from: '#f0f9ff', to: '#e0f2fe' },
    land: { from: '#f1f5f9', via: '#e2e8f0', to: '#cbd5e1' },
    water: { from: '#a5f3fc', via: '#67e8f9', to: '#155e75' },
    sunColor: '#fef3c7'
  },
  {
    id: 'tropical',
    name: 'Tropical Paradise',
    emoji: '🌴',
    sky: { from: '#fdf4ff', to: '#f5d0fe' },
    land: { from: '#fef08a', via: '#fde047', to: '#facc15' },
    water: { from: '#5eead4', via: '#2dd4bf', to: '#0f766e' },
    sunColor: '#fb923c'
  },
  {
    id: 'sunset',
    name: 'Golden Sunset',
    emoji: '🌅',
    sky: { from: '#fecaca', to: '#fdba74' },
    land: { from: '#fed7aa', via: '#fdba74', to: '#c2410c' },
    water: { from: '#fb923c', via: '#ea580c', to: '#7c2d12' },
    sunColor: '#f97316'
  },
  {
    id: 'night',
    name: 'Starry Night',
    emoji: '🌙',
    sky: { from: '#1e1b4b', to: '#312e81' },
    land: { from: '#3f3f46', via: '#27272a', to: '#18181b' },
    water: { from: '#1e3a5f', via: '#172554', to: '#0c1929' },
    sunColor: '#fef9c3',
    hasMoon: true,
    hasStars: true
  }
]

const baitTypes: BaitType[] = [
  { id: 'worm', name: '🪱 Worm', price: 0, size: 1, catchRate: 0.3 },
  { id: 'minnow', name: '🐟 Minnow', price: 10, size: 1.2, catchRate: 0.4 },
  { id: 'cricket', name: '🦗 Cricket', price: 15, size: 1, catchRate: 0.45 },
  { id: 'shrimp', name: '🦐 Shrimp', price: 20, size: 1.3, catchRate: 0.5 },
  { id: 'grub', name: '🐛 Grub', price: 25, size: 1.1, catchRate: 0.55 },
  { id: 'spinner', name: '✨ Spinner', price: 35, size: 1.5, catchRate: 0.6 },
  { id: 'fly', name: '🪰 Fly Lure', price: 40, size: 0.8, catchRate: 0.55 },
  { id: 'jig', name: '🎣 Jig', price: 50, size: 1.4, catchRate: 0.65 },
  { id: 'crankbait', name: '🐠 Crankbait', price: 60, size: 1.6, catchRate: 0.7 },
  { id: 'spoon', name: '🥄 Spoon Lure', price: 75, size: 1.7, catchRate: 0.75 },
  { id: 'golden', name: '🌟 Golden Lure', price: 100, size: 2, catchRate: 0.85 },
  { id: 'magic', name: '🔮 Magic Bait', price: 150, size: 2.5, catchRate: 0.95 }
]

const sillyCatPhrases = [
  "Purrfect catch! 🐱",
  "Meow-nificent! I'm the best fisher in town!",
  "This fish is almost as cute as me... almost! 😸",
  "Another one bites the... hook! 🎣",
  "I'd share this fish but... nah, it's mine! 😺",
  "Fishing level: Cat-tastic! 🐾",
  "Who needs opposable thumbs anyway? 😼",
  "Fish fear me, mice adore me! 🐭🐟",
  "I'm not kitten around - I'm a pro! 🎯",
  "Time for a cat-nap... after one more cast! 😴",
  "Whiskers twitching with excitement! ✨",
  "This beats knocking things off tables! 📱💥",
  "Fin-tastic! That's how we do it! 🐟",
  "I'm having a reel-y good time! 🎣",
  "Hook, line, and whisker! 😺",
  "Some-fin special just happened! ✨",
  "I'm the cat's meow at fishing! 😸",
  "Pawsome catch! High-five? Oh wait... 🐾"
]

function App() {
  const [fishCount, setFishCount] = useKV<number>('fishCount', 0)
  const [money, setMoney] = useKV<number>('money', 50)
  const [currentBait, setCurrentBait] = useKV<BaitType>('currentBait', baitTypes[0])
  
  const [isLineCast, setIsLineCast] = useState(false)
  const [boatPosition, setBoatPosition] = useState(50) // Boat X position (percentage)
  const [linePosition, setLinePosition] = useState({ x: 50, y: 80 })
  const [fishPosition, setFishPosition] = useState({ x: 50, y: 70 })
  const [allFish, setAllFish] = useState<FishType[]>([])
  const [showShop, setShowShop] = useState(false)
  const [catchAnimation, setCatchAnimation] = useState(false)
  const [isWaitingToReel, setIsWaitingToReel] = useState(false)
  const [catSpeech, setCatSpeech] = useState('')
  const [showSpeech, setShowSpeech] = useState(false)
  const [caughtFishId, setCaughtFishId] = useState<string | null>(null)
  const [fishFightStage, setFishFightStage] = useState<'fighting' | 'caught' | 'reeling' | null>(null)
  const [fishingTool, setFishingTool] = useState<FishingTool>('rod')
  const [spearPosition, setSpearPosition] = useState<{ x: number; y: number } | null>(null)
  const [isSpearThrown, setIsSpearThrown] = useState(false)
  const [currentEnvironment, setCurrentEnvironment] = useState<Environment>(environments[0])
  const gameAreaRef = useRef<HTMLDivElement>(null)

  // Auto-focus game area on mount for keyboard controls
  useEffect(() => {
    if (gameAreaRef.current) {
      gameAreaRef.current.focus()
    }
  }, [])

  // Keyboard controls for boat movement - using document level for reliable capture
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (fishFightStage) return // Don't move boat while catching fish
      
      const moveSpeed = 5
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault()
        setBoatPosition(prev => Math.max(15, prev - moveSpeed))
        // Update line position to follow boat if not cast
        if (!isLineCast) {
          setLinePosition(prev => ({ ...prev, x: Math.max(15, prev.x - moveSpeed) }))
        }
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault()
        setBoatPosition(prev => Math.min(85, prev + moveSpeed))
        // Update line position to follow boat if not cast
        if (!isLineCast) {
          setLinePosition(prev => ({ ...prev, x: Math.min(85, prev.x + moveSpeed) }))
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isLineCast, fishFightStage])

  // Initialize all fish
  useEffect(() => {
    const initialFish: FishType[] = [
      // Main pink fish - keep in water area (bottom half)
      { id: 'pink-main', x: 50, y: 70, size: 'large', color: '#ff69b4', speed: 1, direction: 0 },
      // 4 small fish - all in water area (bottom half of screen)
      { id: 'small-1', x: 25, y: 60, size: 'small', color: '#87ceeb', speed: 1.5, direction: 45 },
      { id: 'small-2', x: 60, y: 80, size: 'small', color: '#98fb98', speed: 1.2, direction: 135 },
      { id: 'small-3', x: 40, y: 85, size: 'small', color: '#dda0dd', speed: 1.8, direction: 225 },
      { id: 'small-4', x: 75, y: 65, size: 'small', color: '#f0e68c', speed: 1.3, direction: 315 },
      // 4 large fish - all in water area (bottom half)
      { id: 'large-1', x: 20, y: 75, size: 'large', color: '#ff7f50', speed: 0.8, direction: 90 },
      { id: 'large-2', x: 80, y: 85, size: 'large', color: '#20b2aa', speed: 0.6, direction: 180 },
      { id: 'large-3', x: 35, y: 55, size: 'large', color: '#daa520', speed: 0.9, direction: 270 },
      { id: 'large-4', x: 65, y: 90, size: 'large', color: '#9370db', speed: 0.7, direction: 0 }
    ]
    setAllFish(initialFish)
  }, [])

  useEffect(() => {
    const moveAllFish = setInterval(() => {
      setAllFish(currentFish => 
        currentFish.map(fish => {
          let newX = fish.x + Math.cos(fish.direction * Math.PI / 180) * fish.speed
          let newY = fish.y + Math.sin(fish.direction * Math.PI / 180) * fish.speed
          let newDirection = fish.direction
          
          // Bounce off walls - fish stay within water area (bottom half of screen)
          if (newX <= 10 || newX >= 90) {
            newDirection = 180 - fish.direction
            newX = Math.max(10, Math.min(90, newX))
          }
          if (newY <= 50 || newY >= 95) {
            newDirection = -fish.direction
            newY = Math.max(50, Math.min(95, newY))
          }
          
          // Random direction changes
          if (Math.random() < 0.1) {
            newDirection += (Math.random() - 0.5) * 60
          }
          
          return {
            ...fish,
            x: newX,
            y: newY,
            direction: newDirection
          }
        })
      )
      
      // Update main fish position for backward compatibility
      setFishPosition(current => {
        const mainFish = allFish.find(f => f.id === 'pink-main')
        return mainFish ? { x: mainFish.x, y: mainFish.y } : current
      })
    }, 200)
    
    return () => clearInterval(moveAllFish)
  }, [allFish])

  // Helper function to catch a fish
  const attemptCatch = useCallback((targetX: number, targetY: number, isSpear: boolean = false) => {
    // Check if we caught any fish
    const catchRadius = isSpear ? 10 : 15 // Spear is more precise
    const caughtFish = allFish.find(fish => {
      const distance = Math.abs(fish.x - targetX) + Math.abs(fish.y - targetY)
      const baseRadius = fish.size === 'small' ? catchRadius : catchRadius + 10
      return distance < baseRadius
    })
    
    if (caughtFish) {
      const bait = currentBait || baitTypes[0]
      const sizeBonus = caughtFish.size === 'large' ? 1.5 : 1
      // Spear has higher catch rate but requires more skill (smaller target)
      const toolBonus = isSpear ? 1.3 : 1
      const catchChance = bait.catchRate * sizeBonus * toolBonus
      
      if (Math.random() < catchChance) {
        const fishValue = caughtFish.size === 'large' ? 2 : 1
        setCaughtFishId(caughtFish.id)
        setLinePosition({ x: targetX, y: targetY })
        
        if (isSpear) {
          // Spear catch is faster and more dramatic
          setFishFightStage('caught')
          setCatchAnimation(true)
          
          const randomPhrase = sillyCatPhrases[Math.floor(Math.random() * sillyCatPhrases.length)]
          setCatSpeech(randomPhrase)
          setShowSpeech(true)
          
          const fishType = caughtFish.size === 'large' ? 'big fish' : 'small fish'
          toast.success(`Speared a ${fishType}! 🎯🐟`)
          
          setTimeout(() => {
            setFishFightStage('reeling')
          }, 1000)
          
          setTimeout(() => {
            setFishCount(current => (current || 0) + fishValue)
            setCatchAnimation(false)
            setShowSpeech(false)
            setCaughtFishId(null)
            setFishFightStage(null)
            setIsSpearThrown(false)
            setSpearPosition(null)
          }, 2500)
        } else {
          // Normal rod fishing animation sequence
          setFishFightStage('fighting')
          
          setTimeout(() => {
            setFishFightStage('caught')
            setCatchAnimation(true)
            
            const randomPhrase = sillyCatPhrases[Math.floor(Math.random() * sillyCatPhrases.length)]
            setCatSpeech(randomPhrase)
            setShowSpeech(true)
            
            const fishType = caughtFish.size === 'large' ? 'big fish' : 'small fish'
            toast.success(`Caught a ${fishType}! 🐟`)
          }, 1500)
          
          setTimeout(() => {
            setFishFightStage('reeling')
          }, 2500)
          
          setTimeout(() => {
            setFishCount(current => (current || 0) + fishValue)
            setCatchAnimation(false)
            setShowSpeech(false)
            setCaughtFishId(null)
            setFishFightStage(null)
          }, 4000)
        }
        return true
      } else {
        toast('The fish got away...')
        return false
      }
    } else {
      toast(isSpear ? 'Missed! Try again!' : 'No fish near your hook!')
      return false
    }
  }, [allFish, currentBait, setFishCount])

  const handleFishingClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (fishFightStage) return // Don't allow new casts while catching
    
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    
    // Only allow fishing in water area (bottom half of screen)
    const isInWater = y >= 50
    if (!isInWater) {
      toast('You can only fish in the water!')
      return
    }
    
    if (fishingTool === 'spear') {
      // Spear fishing - instant action, throw spear at target
      if (!isSpearThrown) {
        setIsSpearThrown(true)
        setSpearPosition({ x, y })
        
        // Animate spear throw and check for catch
        setTimeout(() => {
          attemptCatch(x, y, true)
          if (!caughtFishId) {
            // Reset spear if no catch
            setTimeout(() => {
              setIsSpearThrown(false)
              setSpearPosition(null)
            }, 500)
          }
        }, 300)
      }
    } else {
      // Rod fishing - cast and reel
      if (!isLineCast && !isWaitingToReel) {
        // Cast the line to where the user clicked
        setIsLineCast(true)
        setLinePosition({ x, y })
        setIsWaitingToReel(true)
      } else if (isWaitingToReel) {
        // Reel in the line
        setIsWaitingToReel(false)
        attemptCatch(linePosition.x, linePosition.y, false)
        setIsLineCast(false)
        setLinePosition({ x: boatPosition, y: 80 })
      }
    }
  }

  // Handle clicking directly on a fish for better UX
  const handleFishClick = (fish: FishType, event: React.MouseEvent) => {
    event.stopPropagation()
    if (fishFightStage) return
    
    if (fishingTool === 'spear') {
      setIsSpearThrown(true)
      setSpearPosition({ x: fish.x, y: fish.y })
      
      setTimeout(() => {
        attemptCatch(fish.x, fish.y, true)
        if (!caughtFishId) {
          setTimeout(() => {
            setIsSpearThrown(false)
            setSpearPosition(null)
          }, 500)
        }
      }, 300)
    } else {
      // Auto-cast and catch when clicking directly on fish
      setIsLineCast(true)
      setLinePosition({ x: fish.x, y: fish.y })
      
      // Small delay to show the line going to fish, then auto-reel
      setTimeout(() => {
        attemptCatch(fish.x, fish.y, false)
        setIsLineCast(false)
        setLinePosition({ x: boatPosition, y: 80 })
      }, 500)
    }
  }

  // Fish rendering component
  const renderFish = (fish: FishType) => {
    const scale = fish.size === 'small' ? 0.6 : 1.2
    const width = fish.size === 'small' ? 32 : 56
    const height = fish.size === 'small' ? 24 : 42
    
    // Special positioning and animation for caught fish
    let fishStyle: React.CSSProperties = { 
      left: `${fish.x}%`, 
      top: `${fish.y}%`,
      transform: `scale(${scale})`,
      cursor: fishFightStage ? 'default' : 'pointer'
    }
    
    let fishClasses = "absolute fish-float transition-all duration-300"
    
    if (caughtFishId === fish.id) {
      if (fishFightStage === 'fighting') {
        // Fish fights back - rapid shaking and moving
        fishClasses += " fish-struggle"
        fishStyle.left = `${linePosition.x}%`
        fishStyle.top = `${linePosition.y}%`
      } else if (fishFightStage === 'caught') {
        // Fish is caught but still at hook position, slightly enlarged
        fishStyle.transform = `scale(${scale * 1.3})`
        fishStyle.left = `${linePosition.x}%`
        fishStyle.top = `${linePosition.y}%`
      } else if (fishFightStage === 'reeling') {
        // Fish gets reeled up to the cat
        fishClasses += " transition-all duration-1000 ease-out"
        fishStyle.left = `${boatPosition}%`
        fishStyle.top = "8%"
        fishStyle.transform = `scale(${scale * 0.8}) rotate(-10deg)`
      }
    }
    
    return (
      <div 
        key={fish.id}
        className={fishClasses}
        style={fishStyle}
        onClick={(e) => handleFishClick(fish, e)}
        title="Click to catch!"
      >
        <svg width={width} height={height} viewBox="0 0 48 36" className="cute-fish">
          <g>
            <ellipse cx="24" cy="18" rx="15" ry="10.5" fill={fish.color} />
            <ellipse cx="24" cy="18" rx="12" ry="8.25" fill={fish.color} fillOpacity="0.8" />
            
            <path d="M9 18 L3 12 L6 18 L3 24 Z" fill={fish.color} fillOpacity="0.9" />
            
            <path d="M36 12 L42 9 L45 15 L39 18 Z" fill={fish.color} fillOpacity="0.9" />
            <path d="M36 24 L42 27 L45 21 L39 18 Z" fill={fish.color} fillOpacity="0.9" />
            
            <circle cx="30" cy="13.5" r="3.75" fill="white" />
            <circle cx="30.75" cy="12.75" r="2.25" fill="black" />
            <circle cx="31.5" cy="12" r="0.75" fill="white" />
            
            <path d="M18 22.5 Q24 24 30 22.5" stroke={fish.color} strokeWidth="1.5" fill="none" strokeLinecap="round" fillOpacity="0.9" />
            
            <ellipse cx="12" cy="15" rx="2.25" ry="1.5" fill={fish.color} opacity="0.4" />
            <ellipse cx="15" cy="21" rx="1.5" ry="1.05" fill={fish.color} opacity="0.4" />
            <ellipse cx="27" cy="22.5" rx="1.8" ry="1.2" fill={fish.color} opacity="0.4" />
          </g>
        </svg>
        
        {/* Enhanced bubble effects during fighting */}
        {caughtFishId === fish.id && fishFightStage === 'fighting' && (
          <>
            <div className="absolute -top-2 -left-2 w-2 h-2 bg-blue-200 rounded-full opacity-70 animate-ping"></div>
            <div className="absolute -top-1 left-3 w-1.5 h-1.5 bg-blue-100 rounded-full opacity-60 animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <div className="absolute top-1 -left-1 w-1 h-1 bg-blue-300 rounded-full opacity-80 animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </>
        )}
        
        {fish.size === 'small' && caughtFishId !== fish.id && (
          <div className="absolute -top-1 -left-0.5 w-0.5 h-0.5 bg-blue-200 rounded-full opacity-70 animate-bounce" style={{animationDelay: `${Math.random()}s`, animationDuration: '2s'}}></div>
        )}
        
        {fish.size === 'large' && caughtFishId !== fish.id && (
          <>
            <div className="absolute -top-2 -left-1 w-1 h-1 bg-blue-200 rounded-full opacity-70 animate-bounce" style={{animationDelay: '0s', animationDuration: '2s'}}></div>
            <div className="absolute -top-3 left-2 w-1.5 h-1.5 bg-blue-100 rounded-full opacity-60 animate-bounce" style={{animationDelay: '0.5s', animationDuration: '2.5s'}}></div>
            <div className="absolute -top-4 left-4 w-1 h-1 bg-blue-200 rounded-full opacity-50 animate-bounce" style={{animationDelay: '1s', animationDuration: '3s'}}></div>
          </>
        )}
      </div>
    )
  }

  const sellAllFish = () => {
    if ((fishCount || 0) > 0) {
      const earnings = (fishCount || 0) * 5
      setMoney(current => (current || 0) + earnings)
      setFishCount(0)
      toast.success(`Sold ${fishCount} fish for ${earnings} coins!`)
    }
  }

  const buyBait = (bait: BaitType) => {
    if ((money || 0) >= bait.price) {
      setMoney(current => (current || 0) - bait.price)
      setCurrentBait(bait)
      toast.success(`Purchased ${bait.name}!`)
    } else {
      toast.error('Not enough coins!')
    }
  }

  return (
    <>
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            {/* Logo and Title */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Cute fishing cat logo */}
              <div className="relative">
                <svg width="60" height="60" viewBox="0 0 80 80" className="drop-shadow-lg sm:w-20 sm:h-20">
                  {/* Cat body */}
                  <ellipse cx="40" cy="55" rx="20" ry="14" fill="#f97316" />
                  
                  {/* Cat head */}
                  <circle cx="40" cy="35" r="18" fill="#f97316" />
                  
                  {/* Cat ears */}
                  <path d="M25 25 L20 10 L35 22 Z" fill="#f97316" />
                  <path d="M55 25 L60 10 L45 22 Z" fill="#f97316" />
                  <path d="M25 22 L22 12 L33 20 Z" fill="#fbbf24" />
                  <path d="M55 22 L58 12 L47 20 Z" fill="#fbbf24" />
                  
                  {/* Cat face */}
                  <circle cx="32" cy="30" r="2.5" fill="black" />
                  <circle cx="48" cy="30" r="2.5" fill="black" />
                  <circle cx="33" cy="29" r="0.8" fill="white" />
                  <circle cx="49" cy="29" r="0.8" fill="white" />
                  
                  {/* Cat nose */}
                  <path d="M40 38 L37 41 L43 41 Z" fill="#dc2626" />
                  
                  {/* Cat mouth - happy smile */}
                  <path d="M40 41 Q35 45 30 42" stroke="black" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  <path d="M40 41 Q45 45 50 42" stroke="black" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  
                  {/* Cat whiskers */}
                  <line x1="18" y1="32" x2="28" y2="30" stroke="black" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="18" y1="38" x2="28" y2="36" stroke="black" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="52" y1="30" x2="62" y2="32" stroke="black" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="52" y1="36" x2="62" y2="38" stroke="black" strokeWidth="1.2" strokeLinecap="round" />
                  
                  {/* Fishing rod */}
                  <line x1="50" y1="60" x2="70" y2="25" stroke="#8b4513" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="70" cy="25" r="1.5" fill="#8b4513" />
                  
                  {/* Fishing line with hook */}
                  <line x1="70" y1="25" x2="75" y2="40" stroke="#333" strokeWidth="1" />
                  <path d="M75 40 L73 42 L77 42 L76 44" stroke="#silver" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  
                  {/* Small fish on hook */}
                  <ellipse cx="76" cy="46" rx="4" ry="2.5" fill="#ff69b4" />
                  <circle cx="78" cy="45" r="1" fill="white" />
                  <circle cx="78" cy="45" r="0.5" fill="black" />
                </svg>
              </div>
              
              <div className="text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                  Purrfect Catch
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground italic">The most claw-some fishing adventure!</p>
              </div>
            </div>

            {/* Stats moved to right side */}
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <Fish className="text-accent" size={24} />
                <span className="text-foreground font-medium">{fishCount || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="text-yellow-400" size={24} />
                <span className="text-foreground font-medium">{money || 0}</span>
              </div>
            </div>
          </header>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  {/* Environment selector */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-sm font-medium text-card-foreground self-center mr-2">🌍 Environment:</span>
                    {environments.map((env) => (
                      <button
                        key={env.id}
                        onClick={() => setCurrentEnvironment(env)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          currentEnvironment.id === env.id
                            ? 'bg-accent text-white shadow-md scale-105'
                            : 'bg-secondary/50 text-card-foreground hover:bg-secondary/80'
                        }`}
                      >
                        {env.emoji} {env.name}
                      </button>
                    ))}
                  </div>
                  
                  <div 
                    ref={gameAreaRef}
                    className="relative w-full h-96 rounded-lg cursor-pointer overflow-visible outline-none focus:ring-2 focus:ring-accent"
                    style={{
                      background: `linear-gradient(to bottom, ${currentEnvironment.water.from}, ${currentEnvironment.water.via}, ${currentEnvironment.water.to})`
                    }}
                    onClick={handleFishingClick}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'a' || e.key === 'd') {
                        e.preventDefault()
                      }
                    }}
                  >
                    {/* Sky with clouds - in the very back, covers top third */}
                    <div 
                      className="absolute top-0 left-0 w-full rounded-t-lg z-0" 
                      style={{
                        height: '33.33%',
                        background: `linear-gradient(to bottom, ${currentEnvironment.sky.from}, ${currentEnvironment.sky.to})`
                      }}
                    >
                      {/* Stars for night mode */}
                      {currentEnvironment.hasStars && (
                        <>
                          <div className="absolute top-2 left-[10%] w-1 h-1 bg-white rounded-full animate-pulse"></div>
                          <div className="absolute top-4 left-[20%] w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                          <div className="absolute top-1 left-[35%] w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                          <div className="absolute top-6 left-[50%] w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                          <div className="absolute top-3 left-[65%] w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDelay: '0.7s'}}></div>
                          <div className="absolute top-5 left-[80%] w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{animationDelay: '1.2s'}}></div>
                          <div className="absolute top-8 left-[15%] w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{animationDelay: '0.9s'}}></div>
                          <div className="absolute top-7 left-[45%] w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                        </>
                      )}
                      
                      {/* Sun or Moon */}
                      <div className="absolute top-3 right-8 z-10">
                        {currentEnvironment.hasMoon ? (
                          <svg width="40" height="40" viewBox="0 0 40 40" className="animate-pulse" style={{animationDuration: '4s'}}>
                            <circle cx="20" cy="20" r="14" fill={currentEnvironment.sunColor} />
                            <circle cx="14" cy="14" r="3" fill="#fef3c7" opacity="0.5" />
                            <circle cx="24" cy="22" r="2" fill="#fef3c7" opacity="0.3" />
                            <circle cx="18" cy="26" r="1.5" fill="#fef3c7" opacity="0.4" />
                          </svg>
                        ) : (
                          <svg width="50" height="50" viewBox="0 0 50 50" className="animate-pulse" style={{animationDuration: '4s'}}>
                            {/* Sun rays */}
                            <g stroke={currentEnvironment.sunColor} strokeWidth="2" strokeLinecap="round">
                              <line x1="25" y1="2" x2="25" y2="8" />
                              <line x1="25" y1="42" x2="25" y2="48" />
                              <line x1="2" y1="25" x2="8" y2="25" />
                              <line x1="42" y1="25" x2="48" y2="25" />
                              <line x1="8.1" y1="8.1" x2="12.2" y2="12.2" />
                              <line x1="37.8" y1="37.8" x2="41.9" y2="41.9" />
                              <line x1="8.1" y1="41.9" x2="12.2" y2="37.8" />
                              <line x1="37.8" y1="12.2" x2="41.9" y2="8.1" />
                            </g>
                            <circle cx="25" cy="25" r="12" fill={currentEnvironment.sunColor} stroke="#f59e0b" strokeWidth="1" />
                            {/* Sun face */}
                            <circle cx="21" cy="21" r="1.5" fill="#f59e0b" />
                            <circle cx="29" cy="21" r="1.5" fill="#f59e0b" />
                            <path d="M20 28 Q25 32 30 28" stroke="#f59e0b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                          </svg>
                        )}
                      </div>
                      
                      {/* Cloud 1 */}
                      <div className="absolute top-4 left-8 opacity-80 z-10">
                        <svg width="60" height="30" viewBox="0 0 60 30">
                          <circle cx="15" cy="15" r="8" fill="white" />
                          <circle cx="25" cy="12" r="10" fill="white" />
                          <circle cx="35" cy="15" r="8" fill="white" />
                          <circle cx="45" cy="18" r="6" fill="white" />
                        </svg>
                      </div>
                      
                      {/* Cloud 2 */}
                      <div className="absolute top-8 right-12 opacity-70 z-10">
                        <svg width="80" height="40" viewBox="0 0 80 40">
                          <circle cx="20" cy="20" r="12" fill="white" />
                          <circle cx="35" cy="15" r="15" fill="white" />
                          <circle cx="50" cy="20" r="10" fill="white" />
                          <circle cx="65" cy="25" r="8" fill="white" />
                        </svg>
                      </div>
                      
                      {/* Cloud 3 */}
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 opacity-60 z-10">
                        <svg width="50" height="25" viewBox="0 0 50 25">
                          <circle cx="12" cy="12" r="7" fill="white" />
                          <circle cx="22" cy="10" r="9" fill="white" />
                          <circle cx="32" cy="12" r="6" fill="white" />
                          <circle cx="40" cy="15" r="5" fill="white" />
                        </svg>
                      </div>
                      
                      {/* Flying seagulls */}
                      <div className="absolute top-6 left-1/4 z-10">
                        <svg width="20" height="12" viewBox="0 0 20 12" className="animate-bounce" style={{animationDuration: '3s', animationDelay: '0s'}}>
                          <path d="M2 6 Q5 2 8 6 Q10 8 12 6 Q15 2 18 6" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
                        </svg>
                      </div>
                      
                      <div className="absolute top-10 right-1/3 z-10">
                        <svg width="16" height="10" viewBox="0 0 16 10" className="animate-bounce" style={{animationDuration: '2.5s', animationDelay: '1s'}}>
                          <path d="M2 5 Q4 2 6 5 Q8 7 10 5 Q12 2 14 5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                        </svg>
                      </div>
                      
                      <div className="absolute top-12 left-2/3 z-10">
                        <svg width="18" height="11" viewBox="0 0 18 11" className="animate-bounce" style={{animationDuration: '3.5s', animationDelay: '2s'}}>
                          <path d="M2 5.5 Q5 1.5 8 5.5 Q9 7.5 11 5.5 Q14 1.5 16 5.5" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
                        </svg>
                      </div>
                    </div>

                    {/* Beach/Land area - middle section from 33% to 50% */}
                    <div 
                      className="absolute inset-0 w-full z-5" 
                      style={{
                        top: '33.33%', 
                        height: '16.67%',
                        background: `linear-gradient(to bottom, ${currentEnvironment.land.from}, ${currentEnvironment.land.via}, ${currentEnvironment.land.to})`
                      }}
                    >
                      {/* Ground texture */}
                      <div className="absolute inset-0 opacity-30">
                        <div className="w-full h-full" style={{
                          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
                                          radial-gradient(circle at 60% 70%, rgba(0, 0, 0, 0.08) 1px, transparent 1px),
                                          radial-gradient(circle at 80% 20%, rgba(0, 0, 0, 0.12) 1px, transparent 1px)`,
                          backgroundSize: '20px 20px, 15px 15px, 25px 25px'
                        }}></div>
                      </div>
                      
                      {/* Trees/vegetation based on environment */}
                      {(currentEnvironment.id === 'beach' || currentEnvironment.id === 'tropical') && (
                        <div className="absolute bottom-2 right-12 z-20">
                          <svg width="70" height="100" viewBox="0 0 70 100">
                            {/* Tree trunk */}
                            <rect x="29" y="40" width="12" height="60" fill="#8B4513" rx="6" />
                            <ellipse cx="35" cy="60" rx="3" ry="10" fill="#654321" />
                            <ellipse cx="35" cy="80" rx="2" ry="6" fill="#654321" />
                            
                            {/* Palm fronds */}
                            <path d="M35 40 Q27 25 17 15 Q13 12 17 10 Q23 12 35 30" fill="#228B22" />
                            <path d="M35 40 Q43 25 53 15 Q57 12 53 10 Q47 12 35 30" fill="#228B22" />
                            <path d="M35 40 Q23 30 9 20 Q5 17 9 15 Q15 17 33 30" fill="#32CD32" />
                            <path d="M35 40 Q47 30 61 20 Q65 17 61 15 Q55 17 37 30" fill="#32CD32" />
                            <path d="M35 40 Q35 22 33 5 Q32 0 35 0 Q38 0 37 5 Q35 22 35 40" fill="#228B22" />
                          </svg>
                        </div>
                      )}
                      
                      {currentEnvironment.id === 'lake' && (
                        <>
                          <div className="absolute bottom-0 right-8 z-20">
                            <svg width="50" height="80" viewBox="0 0 50 80">
                              <path d="M25 80 L25 20" stroke="#4a3728" strokeWidth="4" />
                              <path d="M25 20 Q15 10 25 0 Q35 10 25 20" fill="#228B22" />
                              <path d="M25 35 Q10 25 25 15 Q40 25 25 35" fill="#22c55e" />
                              <path d="M25 50 Q5 40 25 30 Q45 40 25 50" fill="#16a34a" />
                            </svg>
                          </div>
                          <div className="absolute bottom-0 right-24 z-20">
                            <svg width="40" height="60" viewBox="0 0 40 60">
                              <path d="M20 60 L20 15" stroke="#4a3728" strokeWidth="3" />
                              <path d="M20 15 Q12 8 20 0 Q28 8 20 15" fill="#228B22" />
                              <path d="M20 28 Q8 20 20 12 Q32 20 20 28" fill="#22c55e" />
                              <path d="M20 40 Q5 32 20 24 Q35 32 20 40" fill="#16a34a" />
                            </svg>
                          </div>
                        </>
                      )}
                      
                      {currentEnvironment.id === 'arctic' && (
                        <>
                          <div className="absolute bottom-0 right-16 z-20">
                            <svg width="60" height="50" viewBox="0 0 60 50">
                              <path d="M0 50 L15 20 L30 50 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
                              <path d="M20 50 L40 10 L60 50 Z" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
                            </svg>
                          </div>
                          <div className="absolute bottom-2 left-24 z-20">
                            <svg width="30" height="40" viewBox="0 0 30 40">
                              <ellipse cx="15" cy="30" rx="12" ry="8" fill="white" />
                              <ellipse cx="15" cy="20" rx="8" ry="6" fill="white" />
                              <circle cx="15" cy="10" r="5" fill="white" />
                              <circle cx="13" cy="8" r="1" fill="black" />
                              <circle cx="17" cy="8" r="1" fill="black" />
                              <path d="M14 11 L16 11" stroke="orange" strokeWidth="1.5" />
                            </svg>
                          </div>
                        </>
                      )}
                      
                      {currentEnvironment.id === 'night' && (
                        <div className="absolute bottom-0 right-16 z-20">
                          <svg width="50" height="70" viewBox="0 0 50 70">
                            <rect x="20" y="30" width="10" height="40" fill="#3f3f46" />
                            <circle cx="25" cy="20" r="15" fill="#27272a" />
                            <rect x="8" y="10" width="5" height="10" fill="#fbbf24" opacity="0.8" />
                            <rect x="37" y="10" width="5" height="10" fill="#fbbf24" opacity="0.8" />
                          </svg>
                        </div>
                      )}
                      
                      {/* Three cheering cat friends - positioned close to water on beach */}
                      
                      {/* Friend 1 - Orange tabby - closer to water */}
                      <div className="absolute bottom-0 left-16 z-20">
                        <svg width="50" height="60" viewBox="0 0 50 60" className="excited-bounce">
                          {/* Cat body */}
                          <ellipse cx="25" cy="45" rx="14" ry="10" fill="#FF8C00" />
                          {/* Tabby stripes on body */}
                          <ellipse cx="25" cy="42" rx="10" ry="2" fill="#FF7F00" />
                          <ellipse cx="25" cy="48" rx="8" ry="1.5" fill="#FF7F00" />
                          
                          {/* Cat head */}
                          <circle cx="25" cy="28" r="12" fill="#FF8C00" />
                          {/* Tabby stripes on head */}
                          <path d="M15 25 Q25 23 35 25" stroke="#FF7F00" strokeWidth="2" fill="none" />
                          <path d="M17 30 Q25 28 33 30" stroke="#FF7F00" strokeWidth="1.5" fill="none" />
                          
                          {/* Cat ears */}
                          <path d="M18 20 L14 8 L26 17 Z" fill="#FF8C00" />
                          <path d="M32 20 L36 8 L24 17 Z" fill="#FF8C00" />
                          <path d="M18 17 L16 10 L24 15 Z" fill="#FFB347" />
                          <path d="M32 17 L34 10 L26 15 Z" fill="#FFB347" />
                          
                          {/* Excited eyes */}
                          <circle cx="21" cy="25" r="2" fill="black" />
                          <circle cx="29" cy="25" r="2" fill="black" />
                          <circle cx="21.5" cy="24" r="0.5" fill="white" />
                          <circle cx="29.5" cy="24" r="0.5" fill="white" />
                          
                          {/* Happy nose */}
                          <path d="M25 30 L23 32 L27 32 Z" fill="#FF1493" />
                          
                          {/* Big excited smile */}
                          <path d="M25 32 Q21 37 17 34" stroke="black" strokeWidth="1" fill="none" strokeLinecap="round" />
                          <path d="M25 32 Q29 37 33 34" stroke="black" strokeWidth="1" fill="none" strokeLinecap="round" />
                          
                          {/* Raised paws (cheering) */}
                          <circle cx="15" cy="35" r="3" fill="#FF8C00" className="cheer-wave" style={{animationDelay: '0s'}} />
                          <circle cx="35" cy="35" r="3" fill="#FF8C00" className="cheer-wave" style={{animationDelay: '0.3s'}} />
                          
                          {/* Enthusiastic tail */}
                          <ellipse cx="38" cy="40" rx="6" ry="3" fill="#FF8C00" className="tail-wiggle" />
                        </svg>
                        
                        {/* Speech bubble */}
                        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white rounded-lg px-2 py-1 shadow-sm text-xs font-bold text-orange-600 whitespace-nowrap z-30">
                          "Go get 'em!"
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                        </div>
                      </div>
                      
                      {/* Friend 2 - Gray cat - closer to water */}
                      <div className="absolute bottom-0 right-28 z-20">
                        <svg width="45" height="55" viewBox="0 0 45 55" className="excited-bounce" style={{animationDelay: '0.5s'}}>
                          {/* Cat body */}
                          <ellipse cx="22" cy="42" rx="12" ry="9" fill="#708090" />
                          
                          {/* Cat head */}
                          <circle cx="22" cy="26" r="10" fill="#708090" />
                          
                          {/* Cat ears */}
                          <path d="M16 18 L12 6 L24 15 Z" fill="#708090" />
                          <path d="M28 18 L32 6 L20 15 Z" fill="#708090" />
                          <path d="M16 15 L14 8 L22 13 Z" fill="#C0C0C0" />
                          <path d="M28 15 L30 8 L22 13 Z" fill="#C0C0C0" />
                          
                          {/* Sparkling eyes */}
                          <circle cx="19" cy="23" r="1.8" fill="black" />
                          <circle cx="25" cy="23" r="1.8" fill="black" />
                          <circle cx="19.5" cy="22" r="0.4" fill="white" />
                          <circle cx="25.5" cy="22" r="0.4" fill="white" />
                          
                          {/* Cute pink nose */}
                          <path d="M22 28 L20 30 L24 30 Z" fill="#FF69B4" />
                          
                          {/* Cheerful smile */}
                          <path d="M22 30 Q19 34 16 31" stroke="black" strokeWidth="0.8" fill="none" strokeLinecap="round" />
                          <path d="M22 30 Q25 34 28 31" stroke="black" strokeWidth="0.8" fill="none" strokeLinecap="round" />
                          
                          {/* Cheering paws */}
                          <circle cx="14" cy="32" r="2.5" fill="#708090" className="cheer-wave" style={{animationDelay: '0.2s'}} />
                          <circle cx="30" cy="32" r="2.5" fill="#708090" className="cheer-wave" style={{animationDelay: '0.7s'}} />
                          
                          {/* Wagging tail */}
                          <ellipse cx="32" cy="38" rx="5" ry="2.5" fill="#708090" className="tail-wiggle" style={{animationDelay: '0.3s'}} />
                        </svg>
                        
                        {/* Speech bubble */}
                        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-white rounded-lg px-2 py-1 shadow-sm text-xs font-bold text-gray-600 whitespace-nowrap z-30">
                          "You got this!"
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                        </div>
                      </div>
                      
                      {/* Friend 3 - Black and white cat - closer to water */}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-20">
                        <svg width="40" height="50" viewBox="0 0 40 50" className="excited-bounce" style={{animationDelay: '1s'}}>
                          {/* Cat body */}
                          <ellipse cx="20" cy="38" rx="10" ry="8" fill="#2F4F4F" />
                          {/* White chest */}
                          <ellipse cx="20" cy="40" rx="6" ry="5" fill="white" />
                          
                          {/* Cat head */}
                          <circle cx="20" cy="22" r="9" fill="#2F4F4F" />
                          {/* White face marking */}
                          <ellipse cx="20" cy="24" rx="5" ry="6" fill="white" />
                          
                          {/* Cat ears */}
                          <path d="M14 14 L10 4 L22 12 Z" fill="#2F4F4F" />
                          <path d="M26 14 L30 4 L18 12 Z" fill="#2F4F4F" />
                          <path d="M14 12 L12 6 L20 10 Z" fill="#FFB6C1" />
                          <path d="M26 12 L28 6 L20 10 Z" fill="#FFB6C1" />
                          
                          {/* Bright eyes */}
                          <circle cx="17" cy="20" r="1.5" fill="black" />
                          <circle cx="23" cy="20" r="1.5" fill="black" />
                          <circle cx="17.3" cy="19" r="0.3" fill="white" />
                          <circle cx="23.3" cy="19" r="0.3" fill="white" />
                          
                          {/* Pink nose */}
                          <path d="M20 25 L18 27 L22 27 Z" fill="#FF1493" />
                          
                          {/* Happy mouth */}
                          <path d="M20 27 Q17 30 15 28" stroke="black" strokeWidth="0.7" fill="none" strokeLinecap="round" />
                          <path d="M20 27 Q23 30 25 28" stroke="black" strokeWidth="0.7" fill="none" strokeLinecap="round" />
                          
                          {/* Paws up in excitement */}
                          <circle cx="12" cy="28" r="2" fill="#2F4F4F" className="cheer-wave" style={{animationDelay: '0.4s'}} />
                          <circle cx="28" cy="28" r="2" fill="#2F4F4F" className="cheer-wave" style={{animationDelay: '0.8s'}} />
                          
                          {/* Excited tail */}
                          <ellipse cx="28" cy="35" rx="4" ry="2" fill="#2F4F4F" className="tail-wiggle" style={{animationDelay: '0.7s'}} />
                        </svg>
                        
                        {/* Speech bubble */}
                        <div className="absolute -top-13 left-1/2 transform -translate-x-1/2 bg-white rounded-lg px-2 py-1 shadow-sm text-xs font-bold text-slate-700 whitespace-nowrap z-30">
                          "Reel 'em in!"
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                        </div>
                      </div>
                      
                      {/* Beach decorations - closer to water */}
                      {/* Seashells */}
                      <div className="absolute bottom-4 right-8 z-20">
                        <svg width="12" height="10" viewBox="0 0 12 10">
                          <path d="M6 2 L2 8 L10 8 Z" fill="#F5DEB3" stroke="#DDD" strokeWidth="0.5" />
                          <line x1="6" y1="2" x2="6" y2="8" stroke="#DDD" strokeWidth="0.3" />
                          <line x1="4" y1="4" x2="4" y2="8" stroke="#DDD" strokeWidth="0.2" />
                          <line x1="8" y1="4" x2="8" y2="8" stroke="#DDD" strokeWidth="0.2" />
                        </svg>
                      </div>
                      
                      <div className="absolute bottom-8 left-8 z-20">
                        <svg width="8" height="8" viewBox="0 0 8 8">
                          <circle cx="4" cy="4" r="3" fill="#FFE4E1" stroke="#DDD" strokeWidth="0.5" />
                          <circle cx="4" cy="4" r="1.5" fill="#F0E68C" />
                        </svg>
                      </div>
                      
                      {/* Small beach grass - closer to water */}
                      <div className="absolute bottom-0 left-24 z-20">
                        <svg width="20" height="15" viewBox="0 0 20 15">
                          <path d="M5 15 Q7 10 8 3" stroke="#9ACD32" strokeWidth="1" fill="none" />
                          <path d="M8 15 Q10 12 12 5" stroke="#9ACD32" strokeWidth="1.2" fill="none" />
                          <path d="M12 15 Q14 11 15 4" stroke="#9ACD32" strokeWidth="1" fill="none" />
                          <path d="M15 15 Q16 13 17 7" stroke="#9ACD32" strokeWidth="0.8" fill="none" />
                        </svg>
                      </div>
                    </div>
                    {/* Water area - bottom half of screen */}
                    <div 
                      className="absolute inset-0 w-full rounded-b-lg z-10" 
                      style={{
                        top: '50%', 
                        height: '50%',
                        background: `linear-gradient(to bottom, ${currentEnvironment.water.from}, ${currentEnvironment.water.via}, ${currentEnvironment.water.to})`
                      }}
                    >
                    </div>
                    
                    {/* Water surface line - horizontal line separating beach and water */}
                    <div className="absolute w-full h-px opacity-50 z-20" style={{top: '50%', backgroundColor: currentEnvironment.water.from}}></div>
                    
                    {/* Cat fishing in boat on the water */}
                    <div 
                      className="absolute transition-all duration-150 z-10"
                      style={{ 
                        left: `${boatPosition}%`,
                        transform: 'translateX(-50%)',
                        top: '160px'
                      }}
                    >
                      {/* Cat speech bubble */}
                      {showSpeech && (
                        <div 
                          className="absolute -top-24 left-1/2 transform -translate-x-1/2 bg-white rounded-lg px-3 py-2 shadow-lg border-2 border-gray-200 z-20 speech-bubble"
                          style={{ minWidth: '200px' }}
                        >
                          <div className="text-xs text-gray-800 font-medium text-center">
                            {catSpeech}
                          </div>
                          {/* Speech bubble tail */}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white"></div>
                        </div>
                      )}
                      
                      {/* Realistic fishing boat */}
                      <svg width="160" height="100" viewBox="0 0 160 100" className="absolute -translate-x-1/2 boat-bob" style={{top: '0px', left: '50%'}}>
                        {/* Water reflection/shadow */}
                        <ellipse cx="80" cy="92" rx="60" ry="6" fill="rgba(0,50,100,0.3)" />
                        
                        {/* Boat hull - realistic wooden design */}
                        <defs>
                          <linearGradient id="hullGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#A0522D" />
                            <stop offset="50%" stopColor="#8B4513" />
                            <stop offset="100%" stopColor="#654321" />
                          </linearGradient>
                          <linearGradient id="deckGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#DEB887" />
                            <stop offset="100%" stopColor="#D2691E" />
                          </linearGradient>
                        </defs>
                        
                        {/* Main hull with curved bow */}
                        <path d="M18 68 Q12 68 15 75 L22 85 Q25 88 35 88 L125 88 Q135 88 138 85 L145 75 Q148 68 142 68 L18 68" 
                              fill="url(#hullGradient)" stroke="#4a3728" strokeWidth="1.5"/>
                        
                        {/* Hull planks (horizontal lines for wood texture) */}
                        <path d="M20 72 L140 72" stroke="#654321" strokeWidth="0.5" opacity="0.6"/>
                        <path d="M19 76 L141 76" stroke="#654321" strokeWidth="0.5" opacity="0.6"/>
                        <path d="M22 80 L138 80" stroke="#654321" strokeWidth="0.5" opacity="0.6"/>
                        <path d="M26 84 L134 84" stroke="#654321" strokeWidth="0.5" opacity="0.6"/>
                        
                        {/* Deck surface */}
                        <path d="M22 68 L138 68 L140 64 Q140 60 135 60 L25 60 Q20 60 20 64 Z" 
                              fill="url(#deckGradient)" stroke="#8B4513" strokeWidth="1"/>
                        
                        {/* Deck planks (vertical wood grain) */}
                        <line x1="40" y1="60" x2="40" y2="68" stroke="#A0522D" strokeWidth="0.5" opacity="0.5"/>
                        <line x1="60" y1="60" x2="60" y2="68" stroke="#A0522D" strokeWidth="0.5" opacity="0.5"/>
                        <line x1="80" y1="60" x2="80" y2="68" stroke="#A0522D" strokeWidth="0.5" opacity="0.5"/>
                        <line x1="100" y1="60" x2="100" y2="68" stroke="#A0522D" strokeWidth="0.5" opacity="0.5"/>
                        <line x1="120" y1="60" x2="120" y2="68" stroke="#A0522D" strokeWidth="0.5" opacity="0.5"/>
                        
                        {/* Gunwale (top edge trim) */}
                        <path d="M22 60 Q20 58 25 58 L135 58 Q140 58 138 60" 
                              fill="none" stroke="#5D4037" strokeWidth="2" strokeLinecap="round"/>
                        
                        {/* Bow decoration */}
                        <path d="M138 64 Q145 64 148 70 Q145 76 138 76" fill="#6D4C41" stroke="#4a3728" strokeWidth="1"/>
                        <circle cx="143" cy="70" r="2" fill="#FFD700" stroke="#DAA520" strokeWidth="0.5"/>
                        
                        {/* Stern decoration */}
                        <path d="M22 64 Q15 64 12 70 Q15 76 22 76" fill="#6D4C41" stroke="#4a3728" strokeWidth="1"/>
                        
                        {/* Wooden mast */}
                        <rect x="77" y="20" width="6" height="40" fill="#8B4513" stroke="#654321" strokeWidth="1" rx="1"/>
                        
                        {/* Mast top cap */}
                        <circle cx="80" cy="18" r="4" fill="#A0522D" stroke="#654321" strokeWidth="1"/>
                        
                        {/* Sail with cloth texture */}
                        <defs>
                          <linearGradient id="sailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FFFAF0" />
                            <stop offset="50%" stopColor="#FFF8DC" />
                            <stop offset="100%" stopColor="#FAF0E6" />
                          </linearGradient>
                        </defs>
                        <path d="M83 20 L83 52 Q95 48 110 38 Q115 34 112 28 L83 20" 
                              fill="url(#sailGradient)" stroke="#DDD" strokeWidth="1"/>
                        
                        {/* Sail stitching lines */}
                        <line x1="85" y1="25" x2="105" y2="32" stroke="#E0E0E0" strokeWidth="0.5"/>
                        <line x1="85" y1="35" x2="108" y2="40" stroke="#E0E0E0" strokeWidth="0.5"/>
                        <line x1="85" y1="45" x2="100" y2="46" stroke="#E0E0E0" strokeWidth="0.5"/>
                        
                        {/* Red pennant flag */}
                        <polygon points="80,14 90,17 80,20" fill="#DC143C" stroke="#B22222" strokeWidth="0.5"/>
                        
                        {/* Rope details */}
                        <path d="M83 52 L90 58" stroke="#8B7355" strokeWidth="1" strokeLinecap="round"/>
                        <path d="M112 28 L125 58" stroke="#8B7355" strokeWidth="1" strokeLinecap="round"/>
                        
                        {/* Small anchor on side */}
                        <g transform="translate(30, 62)">
                          <path d="M0 0 L0 6 M-3 6 L3 6 M0 6 L-2 10 M0 6 L2 10" 
                                stroke="#696969" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                          <circle cx="0" cy="-1" r="1.5" fill="none" stroke="#696969" strokeWidth="1"/>
                        </g>
                        
                        {/* Fishing equipment box */}
                        <rect x="42" y="60" width="12" height="6" fill="#8B7355" stroke="#654321" strokeWidth="0.5" rx="1"/>
                      </svg>
                      
                      <svg width="80" height="80" viewBox="0 0 80 80" className={`transition-transform duration-300 relative ${isLineCast ? 'rotate-12' : ''} ${isWaitingToReel || fishFightStage ? 'cat-fishing' : ''} ${fishFightStage === 'fighting' ? 'scale-110' : ''}`} style={{top: '15px'}}>
                        {/* Cat body */}
                        <ellipse cx="40" cy="56" rx="22" ry="15" fill="#f97316" />
                        
                        {/* Cat head */}
                        <circle cx="40" cy="35" r="20" fill="#f97316" />
                        
                        {/* Cat ears */}
                        <path d="M25 25 L20 10 L35 22 Z" fill="#f97316" />
                        <path d="M55 25 L60 10 L45 22 Z" fill="#f97316" />
                        <path d="M25 22 L22 12 L33 20 Z" fill="#fbbf24" />
                        <path d="M55 22 L58 12 L47 20 Z" fill="#fbbf24" />
                        
                        {/* Cat face */}
                        <circle cx="32" cy="30" r="2.5" fill="black" />
                        <circle cx="48" cy="30" r="2.5" fill="black" />
                        <circle cx="33" cy="29" r="0.8" fill="white" />
                        <circle cx="49" cy="29" r="0.8" fill="white" />
                        
                        {/* Cat nose */}
                        <path d="M40 38 L37 41 L43 41 Z" fill="#dc2626" />
                        
                        {/* Cat mouth */}
                        <path d="M40 41 Q35 45 30 42" stroke="black" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                        <path d="M40 41 Q45 45 50 42" stroke="black" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                        
                        {/* Cat whiskers */}
                        <line x1="18" y1="32" x2="28" y2="30" stroke="black" strokeWidth="1.2" />
                        <line x1="18" y1="38" x2="28" y2="36" stroke="black" strokeWidth="1.2" />
                        <line x1="52" y1="30" x2="62" y2="32" stroke="black" strokeWidth="1.2" />
                        <line x1="52" y1="36" x2="62" y2="38" stroke="black" strokeWidth="1.2" />
                        
                        {/* Cat paws */}
                        <circle cx="30" cy="65" r="5" fill="#f97316" />
                        <circle cx="50" cy="65" r="5" fill="#f97316" />
                        
                        {/* Cat tail with wagging animation */}
                        <ellipse cx="62" cy="50" rx="10" ry="5" fill="#f97316" className={isWaitingToReel || fishFightStage ? 'tail-wag' : ''} style={{transformOrigin: '52px 55px'}} />
                        
                        {/* Fishing tool - rod or spear based on selection */}
                        {fishingTool === 'rod' ? (
                          <>
                            {/* Fishing rod in paw */}
                            <line x1="50" y1="60" x2="56" y2="42" stroke="#8b4513" strokeWidth="3" strokeLinecap="round" />
                            <circle cx="56" cy="42" r="1.5" fill="#8b4513" />
                            {/* Reel */}
                            <circle cx="52" cy="55" r="3" fill="#696969" stroke="#555" strokeWidth="0.5"/>
                          </>
                        ) : (
                          <>
                            {/* Spear in paw */}
                            <line x1="50" y1="60" x2="62" y2="35" stroke="#5D4037" strokeWidth="3" strokeLinecap="round" />
                            {/* Spear head */}
                            <path d="M62 35 L58 28 L62 20 L66 28 Z" fill="#C0C0C0" stroke="#808080" strokeWidth="0.5"/>
                            {/* Spear binding */}
                            <rect x="60" y="32" width="4" height="4" fill="#8B4513" rx="1"/>
                          </>
                        )}
                      </svg>
                      
                      {/* Thrown spear animation */}
                      {isSpearThrown && spearPosition && (
                        <svg 
                          width="30" 
                          height="60" 
                          viewBox="0 0 30 60" 
                          className="absolute spear-throw z-30"
                          style={{
                            left: `${((spearPosition.x - boatPosition) / 100) * 400 + 80}px`,
                            top: `${((spearPosition.y - 42) / 100) * 384}px`,
                            transform: 'rotate(15deg)'
                          }}
                        >
                          {/* Spear shaft */}
                          <line x1="15" y1="10" x2="15" y2="55" stroke="#5D4037" strokeWidth="3" strokeLinecap="round" />
                          {/* Spear head */}
                          <path d="M15 10 L10 0 L15 -5 L20 0 Z" fill="#C0C0C0" stroke="#808080" strokeWidth="0.5"/>
                          {/* Motion lines */}
                          <line x1="8" y1="20" x2="5" y2="25" stroke="#87CEEB" strokeWidth="1" opacity="0.6"/>
                          <line x1="22" y1="25" x2="25" y2="30" stroke="#87CEEB" strokeWidth="1" opacity="0.6"/>
                          <line x1="8" y1="35" x2="5" y2="40" stroke="#87CEEB" strokeWidth="1" opacity="0.6"/>
                        </svg>
                      )}
                    </div>
                    
                    {/* Render all fish */}
                    {allFish.map(fish => renderFish(fish))}
                    
                    {/* Fishing line - only show for rod fishing */}
                    {fishingTool === 'rod' && (
                      <div className={`absolute top-0 w-1 bg-amber-800 transition-all duration-300 ${fishFightStage === 'fighting' ? 'animate-pulse bg-red-600' : ''}`} 
                           style={{ 
                             left: `${isLineCast ? linePosition.x : boatPosition}%`,
                             height: isLineCast ? `${linePosition.y - 40}%` : '10%', 
                             transform: 'translateX(-50%)',
                             top: '215px'
                           }}>
                        {isLineCast && (
                          <div 
                            className={`absolute bottom-0 left-1/2 w-3 h-3 bg-gray-400 rounded-full ${fishFightStage === 'fighting' ? 'animate-ping' : ''}`}
                            style={{ transform: 'translateX(-50%) translateY(50%)' }}
                          ></div>
                        )}
                      </div>
                    )}
                    
                    {/* Instructions and controls hint */}
                    <div className="absolute bottom-4 left-4 text-white/90 text-sm bg-black/30 rounded-lg px-3 py-2">
                      <div className="font-medium">
                        {!isLineCast && !isWaitingToReel && !isSpearThrown ? 
                          (fishingTool === 'rod' ? '🎣 Click water or fish to cast' : '🔱 Click on a fish to throw spear') : 
                         isWaitingToReel && !fishFightStage ? '🎣 Click again to reel in!' : 
                         fishFightStage === 'fighting' ? '🐟 Fish is fighting back!' :
                         fishFightStage === 'reeling' ? '✨ Reeling in your catch!' : 
                         isSpearThrown ? '🔱 Spear thrown!' : 'Reeling in...'}
                      </div>
                      <div className="text-xs opacity-80 mt-1">← → Arrow keys to move boat</div>
                    </div>
                    </div>
                    
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      {/* Fishing tool selector */}
                      <div className="flex gap-1 bg-white/90 rounded-lg p-1 shadow-md">
                        <button
                          onClick={(e) => { e.stopPropagation(); setFishingTool('rod'); }}
                          className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                            fishingTool === 'rod' 
                              ? 'bg-blue-500 text-white shadow-sm' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          title="Fishing Rod - Cast and reel"
                        >
                          🎣 Rod
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setFishingTool('spear'); }}
                          className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                            fishingTool === 'spear' 
                              ? 'bg-orange-500 text-white shadow-sm' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          title="Spear - Quick and precise"
                        >
                          🔱 Spear
                        </button>
                      </div>
                      
                      <Badge variant="secondary" className="bg-secondary/80">
                        {fishingTool === 'rod' ? `Bait: ${currentBait?.name || 'Worm'}` : 'Direct strike!'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-card-foreground">
                    <Fish className="text-accent" />
                    Inventory
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(fishCount || 0) > 0 ? (
                    <>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-card-foreground">{fishCount}</div>
                        <div className="text-sm text-muted-foreground">Pink Fish</div>
                      </div>
                      <Button 
                        onClick={sellAllFish}
                        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                      >
                        Sell All ({(fishCount || 0) * 5} coins)
                      </Button>
                    </>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      No fish caught yet.<br />
                      Cast your line!
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-card-foreground">
                    <ShoppingBag className="text-accent" />
                    Bait Shop
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">Better bait = higher catch rate!</p>
                </CardHeader>
                <CardContent className="space-y-2 max-h-80 overflow-y-auto">
                  {baitTypes.map((bait) => (
                    <div 
                      key={bait.id}
                      className={`flex items-center justify-between p-2 rounded-lg border transition-all ${
                        currentBait?.id === bait.id 
                          ? 'bg-accent/20 border-accent' 
                          : 'bg-secondary/20 border-border hover:bg-secondary/40'
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="text-lg flex-shrink-0">{bait.name.split(' ')[0]}</div>
                        <div className="min-w-0">
                          <div className="font-medium text-card-foreground text-sm truncate">
                            {bait.name.split(' ').slice(1).join(' ')}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {Math.round(bait.catchRate * 100)}% catch
                          </div>
                        </div>
                      </div>
                      
                      {bait.price === 0 ? (
                        <Badge variant={currentBait?.id === bait.id ? 'default' : 'secondary'} className="flex-shrink-0">
                          {currentBait?.id === bait.id ? '✓ Using' : 'Free'}
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => buyBait(bait)}
                          disabled={(money || 0) < bait.price}
                          variant={currentBait?.id === bait.id ? 'default' : 'outline'}
                          className={`flex-shrink-0 text-xs px-2 ${currentBait?.id === bait.id ? 'bg-accent text-accent-foreground' : ''}`}
                        >
                          {currentBait?.id === bait.id ? '✓ Using' : `${bait.price} 🪙`}
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  )
}

export default App