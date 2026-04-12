const SAVE_KEY = "dq-rpg-save-v1"

const SPELLS = {
  heal: { id: "heal", name: "ホイミ", mpCost: 3, unlockLevel: 1, kind: "heal", min: 12, max: 18 },
  fire: { id: "fire", name: "ギラ", mpCost: 4, unlockLevel: 2, kind: "damage", min: 9, max: 15 },
  healmore: { id: "healmore", name: "ベホイミ", mpCost: 7, unlockLevel: 5, kind: "heal", min: 24, max: 34 },
  firemore: { id: "firemore", name: "ベギラマ", mpCost: 8, unlockLevel: 6, kind: "damage", min: 18, max: 28 }
}

const WORLD_MAP = [
  "MMMM MMMM MMMM MMMM MMMM MMMM".replaceAll(" ", ""),
  "MCPP PPFP PPPP PMMM MPPP PDMM".replaceAll(" ", ""),
  "MPPP PFFP PMPP PMMM MPPP PPMM".replaceAll(" ", ""),
  "MPMM PPPP PMPP PPPP PFFF PPMM".replaceAll(" ", ""),
  "MPMM MPPP PMMM PPPP PFFF PPMM".replaceAll(" ", ""),
  "MPPP PTPP PSSP PPPP PPPP PPMM".replaceAll(" ", ""),
  "MPPP PPPP PSSP PFFF PMMM PPMM".replaceAll(" ", ""),
  "MPPP PFFF PPPP PFFF PMMM PPMM".replaceAll(" ", ""),
  "MPPP PFFF PPPP PPPP PPPP PPMM".replaceAll(" ", ""),
  "MPPP PPPP PPPP PMMM MMMP PPMM".replaceAll(" ", ""),
  "MPMM MPPP PPPP PMPP PPPP PPMM".replaceAll(" ", ""),
  "MPPP PPPP PMPP PMPP PPPF PPMM".replaceAll(" ", ""),
  "MPPP PMMM PMPP PMPP PPPF PPMM".replaceAll(" ", ""),
  "MPPP PMPP PMPP PMPP PFFF PPMM".replaceAll(" ", ""),
  "MPPP PMPP PMPP PPPP PFFF PHMM".replaceAll(" ", ""),
  "MPPP PMPP PMMM MMMP PPPP PPMM".replaceAll(" ", ""),
  "MPPP PTPP PPPP PPPP PSSP PPMM".replaceAll(" ", ""),
  "MPPP PPPP PFFF PPPP PSSP PPMM".replaceAll(" ", ""),
  "MPMM MPPP PFFF PMMM MMPP PPMM".replaceAll(" ", ""),
  "MPPP PPPP PPPP PMPP PPPP PPMM".replaceAll(" ", ""),
  "MPPP FFFF PPPP PMPP PFFF PPMM".replaceAll(" ", ""),
  "MPPP PPPP PPPP PPPP PFFF PPMM".replaceAll(" ", ""),
  "MPPP PPPP PPPP PPPP PPPP PPMM".replaceAll(" ", ""),
  "MMMM MMMM MMMM MMMM MMMM MMMM".replaceAll(" ", "")
]

const TILE_INFO = {
  C: { name: "ラダトーム城", safe: true, terrain: "castle" },
  D: { name: "竜王の城", safe: true, terrain: "dragon" },
  F: { name: "森", safe: false, terrain: "forest" },
  H: { name: "岩山の洞窟", safe: true, terrain: "cave" },
  M: { name: "山", safe: true, terrain: "mountain", blocked: true },
  P: { name: "平原", safe: false, terrain: "plain" },
  S: { name: "沼地", safe: false, terrain: "swamp" },
  T: { name: "町", safe: true, terrain: "town" }
}

const LEVEL_TABLE = [
  { xp: 0, maxHp: 18, maxMp: 6, attack: 4, defense: 2 },
  { xp: 8, maxHp: 24, maxMp: 8, attack: 6, defense: 4 },
  { xp: 24, maxHp: 31, maxMp: 10, attack: 9, defense: 6 },
  { xp: 50, maxHp: 39, maxMp: 14, attack: 12, defense: 8 },
  { xp: 90, maxHp: 48, maxMp: 18, attack: 16, defense: 11 },
  { xp: 140, maxHp: 58, maxMp: 22, attack: 20, defense: 14 },
  { xp: 210, maxHp: 69, maxMp: 26, attack: 25, defense: 18 },
  { xp: 300, maxHp: 82, maxMp: 32, attack: 31, defense: 22 }
]

const WEAPONS = [
  { id: "none", name: "なし", bonus: 0, price: 0 },
  { id: "bamboo", name: "たけざお", bonus: 2, price: 12 },
  { id: "club", name: "こんぼう", bonus: 4, price: 24 },
  { id: "sword", name: "どうのつるぎ", bonus: 8, price: 60 },
  { id: "steel", name: "はがねのつるぎ", bonus: 14, price: 120 }
]

const ARMORS = [
  { id: "cloth", name: "ぬののふく", bonus: 0, price: 0 },
  { id: "leather", name: "かわのふく", bonus: 2, price: 20 },
  { id: "chain", name: "くさりかたびら", bonus: 5, price: 45 },
  { id: "steel", name: "はがねのよろい", bonus: 9, price: 100 }
]

const ENEMIES = {
  low: [
    { key: "slime", name: "スライム", maxHp: 6, attack: 4, defense: 1, xp: 2, gold: 3, missChance: 0.12 },
    {
      key: "drakee",
      name: "ドラキー",
      maxHp: 8,
      attack: 5,
      defense: 2,
      xp: 4,
      gold: 4,
      actions: [
        { type: "heavy", chance: 0.28, min: 6, max: 9, message: "ドラキーは くうちゅうから つめを たてた。" }
      ]
    }
  ],
  mid: [
    {
      key: "ghost",
      name: "ゴースト",
      maxHp: 14,
      attack: 8,
      defense: 3,
      xp: 8,
      gold: 7,
      evadeChance: 0.14,
      actions: [
        { type: "drain", chance: 0.25, min: 4, max: 7, message: "ゴーストは いのちを すいとった。" }
      ]
    },
    {
      key: "magician",
      name: "まほうつかい",
      maxHp: 16,
      attack: 9,
      defense: 4,
      xp: 10,
      gold: 10,
      actions: [
        { type: "spell", chance: 0.4, min: 7, max: 11, message: "まほうつかいは ギラを となえた。", ignoresGuard: true }
      ]
    }
  ],
  high: [
    {
      key: "scorpion",
      name: "さそり",
      maxHp: 24,
      attack: 12,
      defense: 6,
      xp: 18,
      gold: 16,
      actions: [
        { type: "poison", chance: 0.3, min: 5, max: 8, message: "さそりの どくばりが ささった。" }
      ]
    },
    {
      key: "knight",
      name: "しりょうのきし",
      maxHp: 32,
      attack: 15,
      defense: 8,
      xp: 28,
      gold: 22,
      evadeChance: 0.08,
      actions: [
        { type: "heavy", chance: 0.28, min: 10, max: 14, message: "しりょうのきしは つよく きりつけた。" }
      ]
    }
  ],
  caveBoss: {
    key: "golem",
    name: "ゴーレム",
    maxHp: 46,
    attack: 16,
    defense: 9,
    xp: 45,
    gold: 30,
    boss: true,
    actions: [
      { type: "heavy", chance: 0.34, min: 11, max: 16, message: "ゴーレムは じひびきを たてて ふみつけた。" }
    ]
  },
  finalBoss: {
    key: "dragonlord",
    name: "りゅうおう",
    maxHp: 78,
    attack: 22,
    defense: 12,
    xp: 0,
    gold: 0,
    boss: true,
    magicResist: 0.3,
    evadeChance: 0.1,
    actions: [
      { type: "flame", chance: 0.42, min: 15, max: 22, message: "りゅうおうは ほのおを はいた。", ignoresGuard: true },
      { type: "spell", chance: 0.22, min: 13, max: 18, message: "りゅうおうは ベギラマを となえた。", ignoresGuard: true }
    ]
  }
}

const START_POSITION = { x: 1, y: 1 }
const VIEWPORT_SIZE = 11
const MOVE_REPEAT_MS = 120

const DIRECTIONS = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 }
}

const TERRAIN_PHOTO_TUNING = {
  plain: { x: 50, y: 68, spreadX: 18, spreadY: 12, scale: 1.14, brightness: 0.92, contrast: 0.9, saturate: 0.84 },
  forest: { x: 50, y: 34, spreadX: 14, spreadY: 16, scale: 1.18, brightness: 0.88, contrast: 0.92, saturate: 0.82 },
  swamp: { x: 50, y: 50, spreadX: 12, spreadY: 10, scale: 1.13, brightness: 0.86, contrast: 0.9, saturate: 0.78 },
  castle: { x: 50, y: 50, spreadX: 10, spreadY: 10, scale: 1.11, brightness: 0.91, contrast: 0.94, saturate: 0.8 },
  town: { x: 50, y: 56, spreadX: 12, spreadY: 12, scale: 1.12, brightness: 0.93, contrast: 0.9, saturate: 0.82 },
  cave: { x: 50, y: 44, spreadX: 12, spreadY: 14, scale: 1.16, brightness: 0.82, contrast: 0.94, saturate: 0.7 },
  dragon: { x: 50, y: 50, spreadX: 10, spreadY: 8, scale: 1.12, brightness: 0.8, contrast: 0.98, saturate: 0.82 },
  mountain: { x: 50, y: 54, spreadX: 16, spreadY: 12, scale: 1.16, brightness: 0.9, contrast: 0.92, saturate: 0.76 }
}

const WEAPON_LOOKUP = Object.fromEntries(WEAPONS.map((item) => [item.id, item]))
const ARMOR_LOOKUP = Object.fromEntries(ARMORS.map((item) => [item.id, item]))
const ENEMY_LOOKUP = Object.fromEntries(
  [...ENEMIES.low, ...ENEMIES.mid, ...ENEMIES.high, ENEMIES.caveBoss, ENEMIES.finalBoss].map((enemy) => [enemy.key, enemy])
)

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function chooseRandom(list) {
  return list[randomInt(0, list.length - 1)]
}

function cloneEnemy(enemy) {
  return {
    ...enemy,
    actions: enemy.actions ? enemy.actions.map((action) => ({ ...action })) : [],
    hp: enemy.maxHp
  }
}

function hydrateEnemy(enemy) {
  if (!enemy) return null

  const base = ENEMY_LOOKUP[enemy.key] || enemy
  return {
    ...base,
    ...enemy,
    actions: enemy.actions ? enemy.actions.map((action) => ({ ...action })) : (base.actions ? base.actions.map((action) => ({ ...action })) : [])
  }
}

function createInitialState() {
  const startingProfile = LEVEL_TABLE[0]

  return {
    version: 2,
    mode: "explore",
    player: {
      level: 1,
      xp: 0,
      gold: 0,
      hp: startingProfile.maxHp,
      mp: startingProfile.maxMp,
      x: START_POSITION.x,
      y: START_POSITION.y,
      weapon: "none",
      armor: "cloth",
      herbs: 1,
      hasSigil: false,
      poisoned: false,
      guarding: false
    },
    progress: {
      caveCleared: false,
      dragonDefeated: false
    },
    enemy: null,
    logs: [
      "ラダトームの王は告げた。『竜王を討ち、平和を取り戻すのだ。』",
      "城を出たら、町で装備を整えてから洞窟へ向かうとよい。"
    ]
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function tileInfoAt(x, y) {
  const tileCode = WORLD_MAP[y]?.[x]
  return tileCode ? TILE_INFO[tileCode] : null
}

function seededUnit(x, y, salt) {
  const raw = Math.sin((x + 1) * 12.9898 + (y + 1) * 78.233 + salt * 37.719) * 43758.5453
  return raw - Math.floor(raw)
}

function loadState() {
  try {
    const raw = window.localStorage.getItem(SAVE_KEY)
    if (!raw) return createInitialState()

    const parsed = JSON.parse(raw)
    if (![1, 2].includes(parsed?.version)) return createInitialState()

    const initial = createInitialState()
    const level = clamp(Number(parsed.player?.level) || 1, 1, LEVEL_TABLE.length)
    const profile = LEVEL_TABLE[level - 1]

    return {
      version: 2,
      mode: ["explore", "battle", "victory"].includes(parsed.mode) ? parsed.mode : "explore",
      player: {
        level,
        xp: Math.max(0, Number(parsed.player?.xp) || 0),
        gold: Math.max(0, Number(parsed.player?.gold) || 0),
        hp: clamp(Number(parsed.player?.hp) || profile.maxHp, 0, profile.maxHp),
        mp: clamp(Number(parsed.player?.mp) || profile.maxMp, 0, profile.maxMp),
        x: clamp(Number(parsed.player?.x) || START_POSITION.x, 0, WORLD_MAP[0].length - 1),
        y: clamp(Number(parsed.player?.y) || START_POSITION.y, 0, WORLD_MAP.length - 1),
        weapon: WEAPON_LOOKUP[parsed.player?.weapon] ? parsed.player.weapon : initial.player.weapon,
        armor: ARMOR_LOOKUP[parsed.player?.armor] ? parsed.player.armor : initial.player.armor,
        herbs: Math.max(0, Number(parsed.player?.herbs) || 0),
        hasSigil: Boolean(parsed.player?.hasSigil),
        poisoned: Boolean(parsed.player?.poisoned),
        guarding: Boolean(parsed.player?.guarding)
      },
      progress: {
        caveCleared: Boolean(parsed.progress?.caveCleared),
        dragonDefeated: Boolean(parsed.progress?.dragonDefeated)
      },
      enemy: hydrateEnemy(parsed.enemy),
      logs: Array.isArray(parsed.logs) && parsed.logs.length > 0 ? parsed.logs.slice(0, 8) : initial.logs
    }
  } catch (_error) {
    return createInitialState()
  }
}

class DragonQuestGame {
  constructor(root) {
    this.root = root
    this.state = loadState()
    this.mapElement = root.querySelector("#dq-map")
    this.modeElement = root.querySelector("#dq-mode")
    this.locationElement = root.querySelector("#dq-location")
    this.statsElement = root.querySelector("#dq-stats")
    this.objectivesElement = root.querySelector("#dq-objectives")
    this.enemyElement = root.querySelector("#dq-enemy")
    this.logElement = root.querySelector("#dq-log")
    this.contextElement = root.querySelector("#dq-context")
    this.actionButton = root.querySelector("#dq-action-button")
    this.attackSpellButton = root.querySelector("#dq-attack-spell-button")
    this.healSpellButton = root.querySelector("#dq-heal-spell-button")
    this.pressedDirections = new Set()
    this.activeHeldDirection = null
    this.moveInterval = null

    this.handleClick = this.handleClick.bind(this)
    this.handleKeydown = this.handleKeydown.bind(this)
    this.handleKeyup = this.handleKeyup.bind(this)

    this.root.addEventListener("click", this.handleClick)
    window.addEventListener("keydown", this.handleKeydown)
    window.addEventListener("keyup", this.handleKeyup)

    this.render()
  }

  destroy() {
    this.root.removeEventListener("click", this.handleClick)
    window.removeEventListener("keydown", this.handleKeydown)
    window.removeEventListener("keyup", this.handleKeyup)
    this.stopHeldMove()
  }

  playerProfile() {
    return LEVEL_TABLE[this.state.player.level - 1]
  }

  playerAttack() {
    return this.playerProfile().attack + WEAPON_LOOKUP[this.state.player.weapon].bonus
  }

  playerDefense() {
    return this.playerProfile().defense + ARMOR_LOOKUP[this.state.player.armor].bonus
  }

  knownSpells() {
    return Object.values(SPELLS).filter((spell) => this.state.player.level >= spell.unlockLevel)
  }

  currentHealSpell() {
    const healingSpells = this.knownSpells().filter((spell) => spell.kind === "heal")
    return healingSpells[healingSpells.length - 1] || null
  }

  currentAttackSpell() {
    const attackSpells = this.knownSpells().filter((spell) => spell.kind === "damage")
    return attackSpells[attackSpells.length - 1] || null
  }

  currentTileCode() {
    return WORLD_MAP[this.state.player.y][this.state.player.x]
  }

  currentTile() {
    return TILE_INFO[this.currentTileCode()]
  }

  currentZone() {
    const distanceFromCastle = Math.abs(this.state.player.x - START_POSITION.x) + Math.abs(this.state.player.y - START_POSITION.y)
    if (this.state.player.x >= 18 && this.state.player.y <= 6) return "high"
    if (distanceFromCastle >= 14 || this.state.player.y >= 12 || this.state.player.x >= 12) return "mid"
    return "low"
  }

  persist() {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(this.state))
  }

  log(message) {
    this.state.logs.unshift(message)
    this.state.logs = this.state.logs.slice(0, 8)
  }

  cureAilments() {
    this.state.player.poisoned = false
    this.state.player.guarding = false
  }

  playerPhysicalDamage(targetDefense) {
    return Math.max(1, this.playerAttack() + randomInt(0, 3) - Math.floor(targetDefense / 2))
  }

  enemyPhysicalDamage(enemyAttack) {
    return Math.max(1, enemyAttack + randomInt(0, 2) - Math.floor(this.playerDefense() / 2))
  }

  applyPlayerDamage(damage, message, options = {}) {
    const { ignoresGuard = false, inflictPoison = false } = options
    let finalDamage = damage

    if (!ignoresGuard && this.state.player.guarding) {
      finalDamage = Math.max(1, Math.floor(finalDamage / 2))
      this.log("ぼうぎょして ダメージを へらした。")
    }

    this.state.player.hp = Math.max(0, this.state.player.hp - finalDamage)
    this.log(`${message}${finalDamage} ダメージを受けた。`)

    if (inflictPoison && !this.state.player.poisoned && this.state.player.hp > 0) {
      this.state.player.poisoned = true
      this.log("どくを うけた。")
    }

    if (this.state.player.hp <= 0) {
      this.respawnAtCastle(`${this.state.enemy?.name || "まもの"}に敗れた。王のもとで再び目を覚ます。`)
    }
  }

  applyFieldPoison() {
    if (!this.state.player.poisoned || this.state.mode !== "explore") return false

    this.state.player.hp = Math.max(0, this.state.player.hp - 1)
    this.log("どくが まわった。1 ダメージを受けた。")

    if (this.state.player.hp <= 0) {
      this.respawnAtCastle("どくが まわり、王に救い出された。")
      return true
    }

    return false
  }

  saveAndRender() {
    this.persist()
    this.render()
  }

  resetGame() {
    this.stopHeldMove()
    this.state = createInitialState()
    this.log("新しい冒険が始まった。")
    this.saveAndRender()
  }

  handleClick(event) {
    const button = event.target.closest("button[data-command], button[data-town-action]")
    if (!button) return

    if (button.dataset.command) {
      this.handleCommand(button.dataset.command, button.dataset.direction)
      return
    }

    this.handleTownAction(button.dataset.townAction)
  }

  handleKeydown(event) {
    if (!this.root.isConnected) return
    const direction = this.directionFromKey(event.key)

    if (direction) {
      event.preventDefault()
      this.pressedDirections.add(direction)
      this.startHeldMove(direction)
    }

    switch (event.key) {
      case "ArrowUp":
      case "w":
      case "W":
      case "ArrowDown":
      case "s":
      case "S":
      case "ArrowLeft":
      case "a":
      case "A":
      case "ArrowRight":
      case "d":
      case "D":
        break
      case " ":
      case "Enter":
        this.handleCommand("action")
        break
      default:
        break
    }
  }

  handleKeyup(event) {
    const direction = this.directionFromKey(event.key)
    if (!direction) return

    this.pressedDirections.delete(direction)

    const remaining = Array.from(this.pressedDirections)
    if (remaining.length === 0) {
      this.stopHeldMove()
    } else {
      this.startHeldMove(remaining[remaining.length - 1])
    }
  }

  directionFromKey(key) {
    switch (key) {
      case "ArrowUp":
      case "w":
      case "W":
        return "up"
      case "ArrowDown":
      case "s":
      case "S":
        return "down"
      case "ArrowLeft":
      case "a":
      case "A":
        return "left"
      case "ArrowRight":
      case "d":
      case "D":
        return "right"
      default:
        return null
    }
  }

  startHeldMove(direction) {
    if (!direction) return

    if (this.activeHeldDirection !== direction) {
      this.activeHeldDirection = direction
    }

    if (this.moveInterval) return

    this.handleCommand("move", direction)
    this.moveInterval = window.setInterval(() => {
      if (!this.activeHeldDirection) return
      this.handleCommand("move", this.activeHeldDirection)
    }, MOVE_REPEAT_MS)
  }

  stopHeldMove() {
    this.activeHeldDirection = null
    if (!this.moveInterval) return

    window.clearInterval(this.moveInterval)
    this.moveInterval = null
  }

  handleCommand(command, direction) {
    if (this.state.progress.dragonDefeated && command !== "reset") {
      this.log("世界には平和が戻った。新しい冒険を始めるなら下のボタンを押そう。")
      this.saveAndRender()
      return
    }

    switch (command) {
      case "move":
        this.move(direction)
        break
      case "action":
        this.performAction()
        break
      case "attack":
        this.attackEnemy()
        break
      case "spell":
        this.castHealSpell()
        break
      case "attack_spell":
        this.castAttackSpell()
        break
      case "heal_spell":
        this.castHealSpell()
        break
      case "defend":
        this.defend()
        break
      case "herb":
        this.useHerb()
        break
      case "run":
        this.runFromBattle()
        break
      case "reset":
        this.resetGame()
        break
      default:
        break
    }
  }

  move(direction) {
    if (this.state.mode === "battle") {
      this.stopHeldMove()
      this.log("戦闘中は移動できない。")
      this.saveAndRender()
      return
    }

    const vector = DIRECTIONS[direction]
    if (!vector) return

    const nextX = this.state.player.x + vector.dx
    const nextY = this.state.player.y + vector.dy
    const nextTile = TILE_INFO[WORLD_MAP[nextY]?.[nextX]]

    if (!nextTile || nextTile.blocked) {
      this.log("行く手を山に阻まれた。")
      this.saveAndRender()
      return
    }

    const previousTileCode = this.currentTileCode()
    this.state.player.x = nextX
    this.state.player.y = nextY

    if (previousTileCode !== WORLD_MAP[nextY][nextX]) {
      this.logArrival(nextTile, WORLD_MAP[nextY][nextX])
    }

    if (WORLD_MAP[nextY][nextX] === "S") {
      this.state.player.hp = Math.max(0, this.state.player.hp - 1)
      this.log("沼地で1ダメージを受けた。")
      if (this.state.player.hp <= 0) {
        this.respawnAtCastle("沼地に力尽き、王に救い出された。")
        this.saveAndRender()
        return
      }
    }

    if (this.applyFieldPoison()) {
      this.saveAndRender()
      return
    }

    this.maybeTriggerEncounter(nextTile)
    this.saveAndRender()
  }

  logArrival(tile, tileCode) {
    switch (tileCode) {
      case "C":
        this.log("ラダトーム城へ もどった。")
        break
      case "T":
        this.log("町へ たどりついた。")
        break
      case "H":
        this.log("岩山の洞窟の 入口だ。")
        break
      case "D":
        this.log("りゅうおうの城が 目の前にある。")
        break
      default:
        break
    }
  }

  maybeTriggerEncounter(tile) {
    if (tile.safe || this.state.mode === "battle") return

    let encounterRate = 0.16
    if (tile.terrain === "forest") encounterRate = 0.24
    if (tile.terrain === "swamp") encounterRate = 0.32

    if (Math.random() >= encounterRate) return

    const enemy = cloneEnemy(chooseRandom(ENEMIES[this.currentZone()]))
    this.stopHeldMove()
    this.state.mode = "battle"
    this.state.enemy = enemy
    this.log(`${enemy.name}が あらわれた。`)
  }

  performAction() {
    if (this.state.mode === "battle") {
      this.attackEnemy()
      return
    }

    switch (this.currentTileCode()) {
      case "C":
        this.restAtCastle()
        break
      case "T":
        this.restAtTown()
        break
      case "H":
        this.enterCave()
        break
      case "D":
        this.challengeDragonlord()
        break
      default:
        this.searchGround()
        break
    }

    this.saveAndRender()
  }

  restAtCastle() {
    const profile = this.playerProfile()
    this.state.player.hp = profile.maxHp
    this.state.player.mp = profile.maxMp
    this.cureAilments()
    this.log("王の間で力を取り戻した。")
    this.log("王は告げた。『洞窟の守り手を倒し、紋章を奪還するのだ。』")
  }

  restAtTown() {
    const cost = 8
    if (this.state.player.gold < cost) {
      this.log("宿代が足りない。まずは魔物を倒して金を集めよう。")
      this.saveAndRender()
      return
    }

    const profile = this.playerProfile()
    this.state.player.gold -= cost
    this.state.player.hp = profile.maxHp
    this.state.player.mp = profile.maxMp
    this.cureAilments()
    this.log("宿屋でゆっくり休んだ。HPとMPが全回復した。")
  }

  searchGround() {
    const roll = Math.random()
    if (roll < 0.22) {
      this.state.player.herbs += 1
      this.log("やくそうを見つけた。")
      return
    }

    if (roll < 0.58) {
      const foundGold = this.currentZone() === "high" ? randomInt(6, 14) : randomInt(2, 8)
      this.state.player.gold += foundGold
      this.log(`${foundGold}Gを拾った。`)
      return
    }

    this.log("しらべたが、何も見つからなかった。")
  }

  enterCave() {
    if (this.state.progress.caveCleared) {
      this.log("洞窟は静まり返っている。紋章はすでに手に入れた。")
      return
    }

    const enemy = cloneEnemy(ENEMIES.caveBoss)
    this.stopHeldMove()
    this.state.mode = "battle"
    this.state.enemy = enemy
    this.log("洞窟の最深部で、ゴーレムが立ちはだかった。")
  }

  challengeDragonlord() {
    if (!this.state.player.hasSigil) {
      this.log("太陽の紋章がないため、竜王の城の結界を破れない。")
      return
    }

    if (this.state.mode === "battle" && this.state.enemy?.key === "dragonlord") return

    const enemy = cloneEnemy(ENEMIES.finalBoss)
    this.stopHeldMove()
    this.state.mode = "battle"
    this.state.enemy = enemy
    this.log("玉座の間で、りゅうおうが不敵に笑った。")
  }

  attackEnemy() {
    if (this.state.mode !== "battle" || !this.state.enemy) {
      this.log("戦う相手がいない。")
      this.saveAndRender()
      return
    }

    if (this.state.enemy.evadeChance && Math.random() < this.state.enemy.evadeChance) {
      this.log(`${this.state.enemy.name}は ひらりと みをかわした。`)
      this.enemyTurn()
      this.saveAndRender()
      return
    }

    const critical = Math.random() < 0.08
    const damage = critical
      ? this.playerAttack() + randomInt(6, 12)
      : this.playerPhysicalDamage(this.state.enemy.defense)
    this.state.enemy.hp = Math.max(0, this.state.enemy.hp - damage)
    this.log(critical ? `かいしんの いちげき。${damage} ダメージ。` : `${this.state.enemy.name}に ${damage} のダメージ。`)

    if (this.state.enemy.hp <= 0) {
      this.finishBattleVictory()
      this.saveAndRender()
      return
    }

    this.enemyTurn()
    this.saveAndRender()
  }

  castAttackSpell() {
    const spell = this.currentAttackSpell()

    if (!spell) {
      this.log("攻撃呪文は まだ おぼえていない。")
      this.saveAndRender()
      return
    }

    if (this.state.mode !== "battle" || !this.state.enemy) {
      this.log(`${spell.name}を使う相手がいない。`)
      this.saveAndRender()
      return
    }

    if (this.state.player.mp < spell.mpCost) {
      this.log("MPが足りない。")
      this.saveAndRender()
      return
    }

    this.state.player.mp -= spell.mpCost
    const resist = this.state.enemy.magicResist || 0
    const rawDamage = randomInt(spell.min, spell.max) + Math.floor(this.state.player.level / 2)
    const damage = Math.max(1, Math.floor(rawDamage * (1 - resist)))
    this.state.enemy.hp = Math.max(0, this.state.enemy.hp - damage)
    this.log(`${spell.name}を となえた。${this.state.enemy.name}に ${damage} ダメージ。`)

    if (this.state.enemy.hp <= 0) {
      this.finishBattleVictory()
      this.saveAndRender()
      return
    }

    this.enemyTurn()
    this.saveAndRender()
  }

  castHealSpell() {
    const spell = this.currentHealSpell()

    if (!spell) {
      this.log("回復呪文は まだ おぼえていない。")
      this.saveAndRender()
      return
    }

    if (this.state.player.mp < spell.mpCost) {
      this.log("MPが足りない。")
      this.saveAndRender()
      return
    }

    if (this.state.player.hp >= this.playerProfile().maxHp) {
      this.log("今は回復する必要がない。")
      this.saveAndRender()
      return
    }

    this.state.player.mp -= spell.mpCost
    const healAmount = randomInt(spell.min, spell.max)
    this.state.player.hp = clamp(this.state.player.hp + healAmount, 0, this.playerProfile().maxHp)
    this.log(`${spell.name}を唱えた。HPが ${healAmount} 回復した。`)

    if (this.state.mode === "battle") {
      this.enemyTurn()
    }

    this.saveAndRender()
  }

  useHerb() {
    if (this.state.player.herbs <= 0) {
      this.log("やくそうがない。")
      this.saveAndRender()
      return
    }

    if (this.state.player.hp >= this.playerProfile().maxHp && !this.state.player.poisoned) {
      this.log("今は使わなくても大丈夫だ。")
      this.saveAndRender()
      return
    }

    this.state.player.herbs -= 1
    const healAmount = randomInt(10, 16)
    this.state.player.hp = clamp(this.state.player.hp + healAmount, 0, this.playerProfile().maxHp)
    this.log(`やくそうを使った。HPが ${healAmount} 回復した。`)

    if (this.state.player.poisoned) {
      this.state.player.poisoned = false
      this.log("どくが きえた。")
    }

    if (this.state.mode === "battle") {
      this.enemyTurn()
    }

    this.saveAndRender()
  }

  runFromBattle() {
    if (this.state.mode !== "battle" || !this.state.enemy) {
      this.log("今は逃げる場面ではない。")
      this.saveAndRender()
      return
    }

    if (this.state.enemy.boss) {
      this.log("ボス戦からは逃げられない。")
      this.saveAndRender()
      return
    }

    const escaped = Math.random() < 0.65
    if (escaped) {
      this.log("すばやく身をひるがえし、戦いから離脱した。")
      this.state.mode = "explore"
      this.state.enemy = null
      this.saveAndRender()
      return
    }

    this.log("逃げきれなかった。")
    this.enemyTurn()
    this.saveAndRender()
  }

  defend() {
    if (this.state.mode !== "battle" || !this.state.enemy) {
      this.log("今はぼうぎょする場面ではない。")
      this.saveAndRender()
      return
    }

    this.state.player.guarding = true
    this.log("ぼうぎょの かまえを とった。")
    this.enemyTurn()
    this.saveAndRender()
  }

  pickEnemyAction() {
    const actions = this.state.enemy?.actions || []

    for (const action of actions) {
      if (Math.random() < action.chance) {
        return action
      }
    }

    return null
  }

  resolveEnemyAction(action) {
    const damage = randomInt(action.min, action.max)

    switch (action.type) {
      case "spell":
      case "flame":
        this.applyPlayerDamage(damage, action.message, { ignoresGuard: Boolean(action.ignoresGuard) })
        break
      case "heavy":
        this.applyPlayerDamage(damage, action.message)
        break
      case "poison":
        this.applyPlayerDamage(damage, action.message, { inflictPoison: true })
        break
      case "drain":
        this.applyPlayerDamage(damage, action.message)
        if (this.state.mode === "battle" && this.state.enemy) {
          const recovered = Math.max(1, Math.floor(damage / 2))
          this.state.enemy.hp = clamp(this.state.enemy.hp + recovered, 0, this.state.enemy.maxHp)
          this.log(`${this.state.enemy.name}の傷が すこし ふさがった。`)
        }
        break
      default:
        this.applyPlayerDamage(damage, `${this.state.enemy.name}の攻撃。`)
        break
    }
  }

  enemyTurn() {
    if (this.state.mode !== "battle" || !this.state.enemy) return

    const action = this.pickEnemyAction()

    if (action) {
      this.resolveEnemyAction(action)
    } else if (this.state.enemy.missChance && Math.random() < this.state.enemy.missChance) {
      this.log(`${this.state.enemy.name}の攻撃は はずれた。`)
    } else {
      const enemyDamage = this.enemyPhysicalDamage(this.state.enemy.attack)
      this.applyPlayerDamage(enemyDamage, `${this.state.enemy.name}の攻撃。`)
    }

    this.state.player.guarding = false
  }

  respawnAtCastle(message) {
    const profile = this.playerProfile()
    this.state.player.gold = Math.floor(this.state.player.gold / 2)
    this.state.player.hp = profile.maxHp
    this.state.player.mp = profile.maxMp
    this.state.player.x = START_POSITION.x
    this.state.player.y = START_POSITION.y
    this.state.mode = "explore"
    this.state.enemy = null
    this.cureAilments()
    this.log(message)
    this.log("持ち金は半分になったが、冒険は続く。")
  }

  finishBattleVictory() {
    const enemy = this.state.enemy
    if (!enemy) return

    this.log(`${enemy.name}を たおした。`)

    if (enemy.key === "golem") {
      this.state.progress.caveCleared = true
      this.state.player.hasSigil = true
      this.log("太陽の紋章を手に入れた。これで竜王の城の結界を破れる。")
    } else if (enemy.key === "dragonlord") {
      this.state.progress.dragonDefeated = true
      this.state.mode = "victory"
      this.state.enemy = null
      this.log("りゅうおうは崩れ落ち、アレフガルドに夜明けが訪れた。")
      return
    }

    this.state.player.xp += enemy.xp
    this.state.player.gold += enemy.gold
    this.log(`${enemy.gold}G と ${enemy.xp}XP を獲得した。`)

    this.state.mode = "explore"
    this.state.enemy = null
    this.checkLevelUp()
  }

  checkLevelUp() {
    let leveled = false
    const previousLevel = this.state.player.level

    while (this.state.player.level < LEVEL_TABLE.length) {
      const nextLevel = LEVEL_TABLE[this.state.player.level]
      if (this.state.player.xp < nextLevel.xp) break

      this.state.player.level += 1
      leveled = true
    }

    if (!leveled) return

    const profile = this.playerProfile()
    this.state.player.hp = profile.maxHp
    this.state.player.mp = profile.maxMp
    this.log(`レベル${this.state.player.level}になった。力がみなぎる。`)

    Object.values(SPELLS)
      .filter((spell) => spell.unlockLevel > previousLevel && spell.unlockLevel <= this.state.player.level)
      .forEach((spell) => this.log(`${spell.name}を おぼえた。`))
  }

  handleTownAction(action) {
    if (this.currentTileCode() !== "T" || this.state.mode === "battle") return

    switch (action) {
      case "rest":
        this.restAtTown()
        break
      case "herb":
        this.buyHerb()
        break
      default:
        if (action.startsWith("weapon:")) {
          this.buyWeapon(action.split(":")[1])
        } else if (action.startsWith("armor:")) {
          this.buyArmor(action.split(":")[1])
        }
        break
    }

    this.saveAndRender()
  }

  buyHerb() {
    const price = 8
    if (this.state.player.gold < price) {
      this.log("やくそうを買う金が足りない。")
      return
    }

    this.state.player.gold -= price
    this.state.player.herbs += 1
    this.log("やくそうを1つ買った。")
  }

  buyWeapon(id) {
    const weapon = WEAPON_LOOKUP[id]
    if (!weapon) return

    if (WEAPONS.findIndex((item) => item.id === this.state.player.weapon) >= WEAPONS.findIndex((item) => item.id === id)) {
      this.log("今の武器のほうが同等以上だ。")
      return
    }

    if (this.state.player.gold < weapon.price) {
      this.log(`${weapon.name}を買うには ${weapon.price}G 必要だ。`)
      return
    }

    this.state.player.gold -= weapon.price
    this.state.player.weapon = weapon.id
    this.log(`${weapon.name}を装備した。攻撃力が上がった。`)
  }

  buyArmor(id) {
    const armor = ARMOR_LOOKUP[id]
    if (!armor) return

    if (ARMORS.findIndex((item) => item.id === this.state.player.armor) >= ARMORS.findIndex((item) => item.id === id)) {
      this.log("今の防具のほうが同等以上だ。")
      return
    }

    if (this.state.player.gold < armor.price) {
      this.log(`${armor.name}を買うには ${armor.price}G 必要だ。`)
      return
    }

    this.state.player.gold -= armor.price
    this.state.player.armor = armor.id
    this.log(`${armor.name}を身につけた。守備力が上がった。`)
  }

  actionLabel() {
    if (this.state.mode === "battle") return "こうげき"

    switch (this.currentTileCode()) {
      case "C":
        return "王の間で休む"
      case "T":
        return "宿で休む"
      case "H":
        return this.state.progress.caveCleared ? "洞窟を調べる" : "洞窟へ進む"
      case "D":
        return this.state.player.hasSigil ? "竜王に挑む" : "結界を調べる"
      default:
        return "しらべる"
    }
  }

  seamValue(x, y, neighborX, neighborY) {
    const tile = tileInfoAt(x, y)
    const neighbor = tileInfoAt(neighborX, neighborY)

    if (!tile || !neighbor) return 0
    return tile.terrain === neighbor.terrain ? 0 : 1
  }

  tileVisualStyle(x, y, terrain) {
    const tuning = TERRAIN_PHOTO_TUNING[terrain]
    const offsetX = (seededUnit(x, y, 1) - 0.5) * tuning.spreadX
    const offsetY = (seededUnit(x, y, 2) - 0.5) * tuning.spreadY
    const scale = tuning.scale + (seededUnit(x, y, 3) - 0.5) * 0.08
    const brightness = tuning.brightness + (seededUnit(x, y, 4) - 0.5) * 0.06
    const contrast = tuning.contrast + (seededUnit(x, y, 5) - 0.5) * 0.05
    const saturate = tuning.saturate + (seededUnit(x, y, 6) - 0.5) * 0.06
    const lightX = 26 + seededUnit(x, y, 7) * 48
    const lightY = 18 + seededUnit(x, y, 8) * 40
    const haze = 0.06 + seededUnit(x, y, 9) * 0.06

    return [
      `--photo-x:${(tuning.x + offsetX).toFixed(2)}%`,
      `--photo-y:${(tuning.y + offsetY).toFixed(2)}%`,
      `--photo-scale:${scale.toFixed(3)}`,
      `--photo-brightness:${brightness.toFixed(3)}`,
      `--photo-contrast:${contrast.toFixed(3)}`,
      `--photo-saturate:${saturate.toFixed(3)}`,
      `--light-x:${lightX.toFixed(2)}%`,
      `--light-y:${lightY.toFixed(2)}%`,
      `--tile-haze:${haze.toFixed(3)}`
    ]
  }

  renderMap() {
    const mapWidth = WORLD_MAP[0].length
    const mapHeight = WORLD_MAP.length
    const halfViewport = Math.floor(VIEWPORT_SIZE / 2)
    const startX = clamp(this.state.player.x - halfViewport, 0, mapWidth - VIEWPORT_SIZE)
    const startY = clamp(this.state.player.y - halfViewport, 0, mapHeight - VIEWPORT_SIZE)
    const visibleRows = WORLD_MAP.slice(startY, startY + VIEWPORT_SIZE)

    this.mapElement.style.setProperty("--map-columns", String(VIEWPORT_SIZE))

    const rows = visibleRows.map((row, rowIndex) =>
      row
        .slice(startX, startX + VIEWPORT_SIZE)
        .split("")
        .map((tileCode, columnIndex) => {
          const worldX = startX + columnIndex
          const worldY = startY + rowIndex
          const tile = TILE_INFO[tileCode]
          const current = worldX === this.state.player.x && worldY === this.state.player.y
          const classes = ["map-tile", `terrain-${tile.terrain}`]
          if (current) classes.push("is-player")
          const styleVars = [
            `--seam-top:${this.seamValue(worldX, worldY, worldX, worldY - 1)}`,
            `--seam-right:${this.seamValue(worldX, worldY, worldX + 1, worldY)}`,
            `--seam-bottom:${this.seamValue(worldX, worldY, worldX, worldY + 1)}`,
            `--seam-left:${this.seamValue(worldX, worldY, worldX - 1, worldY)}`,
            ...this.tileVisualStyle(worldX, worldY, tile.terrain)
          ].join(";")

          return `
            <div class="${classes.join(" ")}" style="${styleVars}" title="${tile.name}" aria-label="${current ? `勇者がいる ${tile.name}` : tile.name}">
              ${current ? '<span class="player-marker" aria-hidden="true"></span>' : ""}
            </div>
          `
        })
        .join("")
    ).join("")

    this.mapElement.innerHTML = rows
  }

  renderStats() {
    const profile = this.playerProfile()
    const weapon = WEAPON_LOOKUP[this.state.player.weapon]
    const armor = ARMOR_LOOKUP[this.state.player.armor]
    const spells = this.knownSpells()

    this.statsElement.innerHTML = `
      <dl class="stats-grid">
        <div><dt>Lv</dt><dd>${this.state.player.level}</dd></div>
        <div><dt>HP</dt><dd>${this.state.player.hp} / ${profile.maxHp}</dd></div>
        <div><dt>MP</dt><dd>${this.state.player.mp} / ${profile.maxMp}</dd></div>
        <div><dt>攻撃</dt><dd>${this.playerAttack()}</dd></div>
        <div><dt>守備</dt><dd>${this.playerDefense()}</dd></div>
        <div><dt>XP</dt><dd>${this.state.player.xp}</dd></div>
        <div><dt>Gold</dt><dd>${this.state.player.gold}G</dd></div>
        <div><dt>薬草</dt><dd>${this.state.player.herbs}</dd></div>
      </dl>
      <div class="equipment-block">
        <p>武器: ${weapon.name}</p>
        <p>防具: ${armor.name}</p>
        <p>太陽の紋章: ${this.state.player.hasSigil ? "入手済み" : "未入手"}</p>
        <p>状態: ${this.state.player.poisoned ? "どく" : "正常"}</p>
        <p>呪文: ${spells.length > 0 ? spells.map((spell) => spell.name).join(" / ") : "なし"}</p>
      </div>
    `
  }

  renderObjectives() {
    const objectives = [
      {
        complete: this.state.progress.caveCleared,
        label: "岩山の洞窟で太陽の紋章を取り戻す"
      },
      {
        complete: this.state.player.level >= 5,
        label: "レベル5以上を目安に装備と魔法を整える"
      },
      {
        complete: this.state.progress.dragonDefeated,
        label: "竜王の城でりゅうおうを倒す"
      }
    ]

    this.objectivesElement.innerHTML = objectives
      .map((objective) => `<p class="${objective.complete ? "objective-done" : ""}">${objective.complete ? "■" : "□"} ${objective.label}</p>`)
      .join("")
  }

  renderEnemy() {
    if (this.state.mode === "victory") {
      this.enemyElement.innerHTML = `
        <div class="enemy-card victory-card">
          <p class="enemy-name">CLEAR</p>
          <p class="enemy-description">りゅうおうは倒れ、世界に光が戻った。</p>
          <p class="enemy-description">さらに遊ぶ場合は、新しい冒険を始めてください。</p>
        </div>
      `
      return
    }

    if (!this.state.enemy) {
      this.enemyElement.innerHTML = `
        <div class="enemy-card">
          <p class="enemy-name">平穏</p>
          <p class="enemy-description">今は敵の気配がない。地形に応じて遭遇率が変わる。</p>
          <p class="enemy-description">森と沼地は危険だが、町と城では安全に準備できる。</p>
        </div>
      `
      return
    }

    this.enemyElement.innerHTML = `
      <div class="enemy-card ${this.state.enemy.boss ? "boss-card" : ""}">
        <p class="enemy-name">${this.state.enemy.name}</p>
        <p class="enemy-description">HP ${this.state.enemy.hp} / ${this.state.enemy.maxHp}</p>
        <p class="enemy-description">攻撃 ${this.state.enemy.attack} / 守備 ${this.state.enemy.defense}</p>
        <p class="enemy-description">${this.state.enemy.boss ? "ボス戦: にげるは使えない" : "通常戦闘"}</p>
        <p class="enemy-description">${this.state.player.poisoned ? "こちらは どく状態" : "状態異常なし"}</p>
      </div>
    `
  }

  renderContext() {
    if (this.state.mode === "battle") {
      const attackSpell = this.currentAttackSpell()
      const healSpell = this.currentHealSpell()

      this.contextElement.innerHTML = `
        <div class="battle-context">
          <p class="panel-label">BATTLE GUIDE</p>
          <p class="context-copy">こうげき呪文: ${attackSpell ? `${attackSpell.name} (${attackSpell.mpCost}MP)` : "未習得"}</p>
          <p class="context-copy">回復呪文: ${healSpell ? `${healSpell.name} (${healSpell.mpCost}MP)` : "未習得"}</p>
          <p class="context-copy">ぼうぎょは 次の いちげきを 半減する。やくそうは どくも なおせる。</p>
        </div>
      `
      return
    }

    if (this.currentTileCode() !== "T" || this.state.mode === "battle") {
      this.contextElement.innerHTML = `
        <p class="context-copy">町に入ると宿屋と装備屋が使える。城では無料回復、平地では「しらべる」で小さな発見がある。</p>
      `
      return
    }

    this.contextElement.innerHTML = `
      <div class="shop-panel">
        <p class="panel-label">TOWN MENU</p>
        <div class="shop-buttons">
          <button class="shop-button" data-town-action="rest" type="button">宿屋 8G</button>
          <button class="shop-button" data-town-action="herb" type="button">やくそう 8G</button>
          ${WEAPONS.filter((item) => item.price > 0)
            .map((item) => `<button class="shop-button" data-town-action="weapon:${item.id}" type="button">${item.name} ${item.price}G</button>`)
            .join("")}
          ${ARMORS.filter((item) => item.price > 0)
            .map((item) => `<button class="shop-button" data-town-action="armor:${item.id}" type="button">${item.name} ${item.price}G</button>`)
            .join("")}
        </div>
      </div>
    `
  }

  renderLog() {
    this.logElement.innerHTML = this.state.logs.map((entry) => `<li>${entry}</li>`).join("")
  }

  renderButtons() {
    this.actionButton.textContent = this.actionLabel()
    const attackSpell = this.currentAttackSpell()
    const healSpell = this.currentHealSpell()

    this.root.querySelectorAll("button[data-command='move']").forEach((button) => {
      button.disabled = this.state.mode === "battle" || this.state.mode === "victory"
    })

    this.root.querySelector("button[data-command='attack']").disabled = this.state.mode !== "battle"
    this.root.querySelector("button[data-command='defend']").disabled = this.state.mode !== "battle"
    this.root.querySelector("button[data-command='run']").disabled = this.state.mode !== "battle"
    this.attackSpellButton.textContent = attackSpell ? attackSpell.name : "じゅもん"
    this.healSpellButton.textContent = healSpell ? healSpell.name : "かいふく"
    this.attackSpellButton.disabled = this.state.mode !== "battle" || !attackSpell || this.state.player.mp < attackSpell.mpCost
    this.healSpellButton.disabled = !healSpell || this.state.player.mp < healSpell.mpCost
  }

  renderHeader() {
    const tile = this.currentTile()
    const battleText = this.state.enemy ? ` / ${this.state.enemy.name}と戦闘中` : ""
    this.locationElement.textContent = `${tile.name}${battleText} / 座標 ${this.state.player.x + 1},${this.state.player.y + 1}`
    this.modeElement.textContent = this.state.mode === "battle" ? "BATTLE" : this.state.mode === "victory" ? "CLEAR" : "EXPLORE"
  }

  render() {
    this.renderHeader()
    this.renderMap()
    this.renderStats()
    this.renderObjectives()
    this.renderEnemy()
    this.renderContext()
    this.renderLog()
    this.renderButtons()
    this.persist()
  }
}

let activeGame = null

function mountDragonQuestGame() {
  activeGame?.destroy()
  activeGame = null

  const root = document.querySelector("[data-dragon-quest-game]")
  if (!root) return

  activeGame = new DragonQuestGame(root)
}

document.addEventListener("turbo:load", mountDragonQuestGame)
document.addEventListener("turbo:before-cache", () => {
  activeGame?.destroy()
  activeGame = null
})
