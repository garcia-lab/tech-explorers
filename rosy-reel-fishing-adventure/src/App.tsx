import { useState, useEffect } from 'react'
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

interface Fish {
  id: string
  x: number
  y: number
  size: 'small' | 'large'
  color: string
  speed: number
  direction: number
}

const baitTypes: BaitType[] = [
  { id: 'worm', name: 'Worm', price: 0, size: 1, catchRate: 0.3 },
  { id: 'minnow', name: 'Minnow', price: 10, size: 1.5, catchRate: 0.5 },
  { id: 'lure', name: 'Special Lure', price: 25, size: 2, catchRate: 0.7 }
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
  const [linePosition, setLinePosition] = useState({ x: 50, y: 80 })
  const [fishPosition, setFishPosition] = useState({ x: 50, y: 70 })
  const [allFish, setAllFish] = useState<Fish[]>([])
  const [showShop, setShowShop] = useState(false)
  const [catchAnimation, setCatchAnimation] = useState(false)
  const [isWaitingToReel, setIsWaitingToReel] = useState(false)
  const [catSpeech, setCatSpeech] = useState('')
  const [showSpeech, setShowSpeech] = useState(false)
  const [caughtFishId, setCaughtFishId] = useState<string | null>(null)
  const [fishFightStage, setFishFightStage] = useState<'fighting' | 'caught' | 'reeling' | null>(null)

  // Initialize all fish
  useEffect(() => {
    const initialFish: Fish[] = [
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

  const handleFishingClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isLineCast && !isWaitingToReel) {
      // Cast the line to where the user clicked
      const rect = event.currentTarget.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 100
      const y = ((event.clientY - rect.top) / rect.height) * 100
      
      // Only allow fishing in water area (bottom half of screen)
      const isInWater = y >= 50
      if (!isInWater) {
        toast('You can only fish in the water!')
        return
      }
      
      setIsLineCast(true)
      setLinePosition({ x, y })
      setIsWaitingToReel(true)
    } else if (isWaitingToReel) {
      // Reel in the line
      setIsWaitingToReel(false)
      
      // Check if we caught any fish
      const caughtFish = allFish.find(fish => {
        const distance = Math.abs(fish.x - linePosition.x) + Math.abs(fish.y - linePosition.y)
        return distance < (fish.size === 'small' ? 15 : 25)
      })
      
      if (caughtFish) {
        const bait = currentBait || baitTypes[0]
        const sizeBonus = caughtFish.size === 'large' ? 1.5 : 1
        const catchChance = bait.catchRate * sizeBonus
        
        if (Math.random() < catchChance) {
          const fishValue = caughtFish.size === 'large' ? 2 : 1
          setCaughtFishId(caughtFish.id)
          
          // Start the fighting animation sequence
          setFishFightStage('fighting')
          
          // After 1.5 seconds of fighting, fish gets caught
          setTimeout(() => {
            setFishFightStage('caught')
            setCatchAnimation(true)
            
            // Show cat speech
            const randomPhrase = sillyCatPhrases[Math.floor(Math.random() * sillyCatPhrases.length)]
            setCatSpeech(randomPhrase)
            setShowSpeech(true)
            
            const fishType = caughtFish.size === 'large' ? 'big fish' : 'small fish'
            toast.success(`Caught a ${fishType}! 🐟`)
          }, 1500)
          
          // After another 1 second, start reeling animation
          setTimeout(() => {
            setFishFightStage('reeling')
          }, 2500)
          
          // Complete the catch after reeling animation
          setTimeout(() => {
            setFishCount(current => (current || 0) + fishValue)
            setCatchAnimation(false)
            setShowSpeech(false)
            setCaughtFishId(null)
            setFishFightStage(null)
          }, 4000)
        } else {
          toast('The fish got away...')
        }
      } else {
        toast('No fish near your hook!')
      }
      
      setIsLineCast(false)
      setLinePosition({ x: 50, y: 80 })
    }
  }

  // Fish rendering component
  const renderFish = (fish: Fish) => {
    const scale = fish.size === 'small' ? 0.6 : 1.2
    const width = fish.size === 'small' ? 32 : 56
    const height = fish.size === 'small' ? 24 : 42
    
    // Special positioning and animation for caught fish
    let fishStyle: React.CSSProperties = { 
      left: `${fish.x}%`, 
      top: `${fish.y}%`,
      transform: `scale(${scale})`
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
        fishStyle.left = `${linePosition.x}%`
        fishStyle.top = "8%"
        fishStyle.transform = `scale(${scale * 0.8}) rotate(-10deg)`
      }
    }
    
    return (
      <div 
        key={fish.id}
        className={fishClasses}
        style={fishStyle}
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
                  <div 
                    className="relative w-full h-96 bg-gradient-to-b from-blue-200 via-blue-300 to-blue-700 rounded-lg cursor-pointer overflow-visible"
                    onClick={handleFishingClick}
                  >
                    {/* Sky with clouds - in the very back, covers top third */}
                    <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-blue-100 to-blue-200 rounded-t-lg z-0" style={{height: '33.33%'}}>
                      {/* Beautiful sun */}
                      <div className="absolute top-3 right-8 z-10">
                        <svg width="50" height="50" viewBox="0 0 50 50" className="animate-pulse" style={{animationDuration: '4s'}}>
                          {/* Sun rays */}
                          <g stroke="#fbbf24" strokeWidth="2" strokeLinecap="round">
                            <line x1="25" y1="2" x2="25" y2="8" />
                            <line x1="25" y1="42" x2="25" y2="48" />
                            <line x1="2" y1="25" x2="8" y2="25" />
                            <line x1="42" y1="25" x2="48" y2="25" />
                            <line x1="8.1" y1="8.1" x2="12.2" y2="12.2" />
                            <line x1="37.8" y1="37.8" x2="41.9" y2="41.9" />
                            <line x1="8.1" y1="41.9" x2="12.2" y2="37.8" />
                            <line x1="37.8" y1="12.2" x2="41.9" y2="8.1" />
                          </g>
                          {/* Sun body with gradient */}
                          <defs>
                            <radialGradient id="sunGradient" cx="50%" cy="50%" r="50%">
                              <stop offset="0%" stopColor="#fde047" />
                              <stop offset="70%" stopColor="#facc15" />
                              <stop offset="100%" stopColor="#eab308" />
                            </radialGradient>
                          </defs>
                          <circle cx="25" cy="25" r="12" fill="url(#sunGradient)" stroke="#f59e0b" strokeWidth="1" />
                          {/* Sun face */}
                          <circle cx="21" cy="21" r="1.5" fill="#f59e0b" />
                          <circle cx="29" cy="21" r="1.5" fill="#f59e0b" />
                          <path d="M20 28 Q25 32 30 28" stroke="#f59e0b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                        </svg>
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
                    <div className="absolute inset-0 w-full bg-gradient-to-b from-yellow-200 via-yellow-300 to-yellow-400 z-5" style={{top: '33.33%', height: '16.67%'}}>
                      {/* Sand texture */}
                      <div className="absolute inset-0 opacity-30">
                        <div className="w-full h-full" style={{
                          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(194, 164, 108, 0.3) 1px, transparent 1px),
                                          radial-gradient(circle at 60% 70%, rgba(194, 164, 108, 0.2) 1px, transparent 1px),
                                          radial-gradient(circle at 80% 20%, rgba(194, 164, 108, 0.4) 1px, transparent 1px)`,
                          backgroundSize: '20px 20px, 15px 15px, 25px 25px'
                        }}></div>
                      </div>
                      
                      {/* Palm tree - positioned close to water on beach */}
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
                    <div className="absolute inset-0 w-full bg-gradient-to-b from-blue-200 via-blue-300 to-blue-700 rounded-lg z-10" style={{top: '50%', height: '50%'}}>
                    </div>
                    
                    {/* Water surface line - horizontal line separating beach and water */}
                    <div className="absolute w-full h-px bg-blue-100 opacity-50 z-20" style={{top: '50%'}}></div>
                    
                    {/* Cat fishing in boat on the water */}
                    <div 
                      className="absolute transition-all duration-300 z-10"
                      style={{ 
                        left: `${linePosition.x}%`,
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
                      
                      {/* Larger fishing boat */}
                      <svg width="160" height="100" viewBox="0 0 160 100" className="absolute -translate-x-1/2" style={{top: '0px', left: '50%'}}>
                        {/* Boat shadow/reflection in water */}
                        <ellipse cx="80" cy="90" rx="55" ry="8" fill="rgba(0,0,0,0.2)" />
                        
                        {/* Boat hull - larger and more detailed */}
                        <path d="M15 70 Q15 58 28 58 L132 58 Q145 58 145 70 L140 82 Q140 88 132 88 L28 88 Q20 88 20 82 Z" fill="#8B4513" stroke="#654321" strokeWidth="2"/>
                        
                        {/* Boat interior */}
                        <path d="M28 63 Q28 60 32 60 L128 60 Q132 60 132 63 L132 75 Q132 78 128 78 L32 78 Q28 78 28 75 Z" fill="#D2691E"/>
                        
                        {/* Boat details */}
                        <circle cx="35" cy="70" r="2.5" fill="#654321"/>
                        <circle cx="125" cy="70" r="2.5" fill="#654321"/>
                        <rect x="40" y="75" width="80" height="2" fill="#654321" rx="1"/>
                        
                        {/* Boat bow decoration */}
                        <path d="M132 63 Q138 65 140 70 Q138 75 132 78" fill="#A0522D" stroke="#654321" strokeWidth="1"/>
                        
                        {/* Mast - taller */}
                        <line x1="80" y1="58" x2="80" y2="15" stroke="#8B4513" strokeWidth="4"/>
                        
                        {/* Larger sail */}
                        <path d="M82 15 L82 50 L115 35 Q118 32 115 28 L82 15" fill="#FFF8DC" stroke="#DDD" strokeWidth="1"/>
                        
                        {/* Sail details */}
                        <line x1="85" y1="20" x2="110" y2="30" stroke="#DDD" strokeWidth="0.5"/>
                        <line x1="85" y1="30" x2="110" y2="40" stroke="#DDD" strokeWidth="0.5"/>
                        
                        {/* Flag on mast */}
                        <polygon points="80,15 85,18 80,21" fill="#ff4444"/>
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
                        
                        {/* Fishing rod in paw */}
                        <line x1="50" y1="60" x2="56" y2="42" stroke="#8b4513" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="56" cy="42" r="1.5" fill="#8b4513" />
                      </svg>
                    </div>
                    
                    {/* Render all fish */}
                    {allFish.map(fish => renderFish(fish))}
                    
                    <div className={`absolute top-0 w-1 bg-amber-800 transition-all duration-300 ${fishFightStage === 'fighting' ? 'animate-pulse bg-red-600' : ''}`} 
                         style={{ 
                           left: `${linePosition.x}%`,
                           height: `${linePosition.y - 40}%`, 
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
                    
                    <div className="absolute bottom-4 left-4 text-white/80 text-sm">
                      {!isLineCast && !isWaitingToReel ? 'Click to cast your line' : 
                       isWaitingToReel && !fishFightStage ? 'Click again to reel in!' : 
                       fishFightStage === 'fighting' ? 'Fish is fighting back!' :
                       fishFightStage === 'reeling' ? 'Reeling in your catch!' : 'Reeling in...'}
                    </div>
                    
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-secondary/80">
                        Current Bait: {currentBait?.name || 'Worm'}
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
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-card-foreground">
                    <ShoppingBag className="text-accent" />
                    Bait Shop
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {baitTypes.map((bait) => (
                    <div 
                      key={bait.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-border"
                    >
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 bg-accent rounded-full"
                          style={{ transform: `scale(${bait.size})` }}
                        ></div>
                        <div>
                          <div className="font-medium text-card-foreground">{bait.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {Math.round(bait.catchRate * 100)}% catch rate
                          </div>
                        </div>
                      </div>
                      
                      {bait.price === 0 ? (
                        <Badge variant={currentBait?.id === bait.id ? 'default' : 'secondary'}>
                          {currentBait?.id === bait.id ? 'Using' : 'Free'}
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => buyBait(bait)}
                          disabled={(money || 0) < bait.price}
                          variant={currentBait?.id === bait.id ? 'default' : 'outline'}
                          className={currentBait?.id === bait.id ? 'bg-accent text-accent-foreground' : ''}
                        >
                          {currentBait?.id === bait.id ? 'Using' : `${bait.price} coins`}
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