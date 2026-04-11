const SAVE_KEY = "dq-rpg-save-v1"
const HEAL_SPELL_COST = 3

const WORLD_MAP = [
  "MMMMMMMMMM",
  "MCPPPFPPDM",
  "MPMMPFMPPM",
  "MPPPPFMPPM",
  "MPFTPPPPPM",
  "MPPSSMFPPM",
  "MPPMMMFPPM",
  "MPPHPPPPPM",
  "MPPPPPPPPM",
  "MMMMMMMMMM"
]

const TILE_INFO = {
  C: { name: "ラダトーム城", symbol: "城", safe: true, terrain: "castle" },
  D: { name: "竜王の城", symbol: "竜", safe: true, terrain: "dragon" },
  F: { name: "森", symbol: "森", safe: false, terrain: "forest" },
  H: { name: "岩山の洞窟", symbol: "洞", safe: true, terrain: "cave" },
  M: { name: "山", symbol: "山", safe: true, terrain: "mountain", blocked: true },
  P: { name: "平原", symbol: "・", safe: false, terrain: "plain" },
  S: { name: "沼地", symbol: "沼", safe: false, terrain: "swamp" },
  T: { name: "町", symbol: "町", safe: true, terrain: "town" }
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
    { key: "slime", name: "スライム", maxHp: 6, attack: 4, defense: 1, xp: 2, gold: 3 },
    { key: "drakee", name: "ドラキー", maxHp: 8, attack: 5, defense: 2, xp: 4, gold: 4 }
  ],
  mid: [
    { key: "ghost", name: "ゴースト", maxHp: 14, attack: 8, defense: 3, xp: 8, gold: 7 },
    { key: "magician", name: "まほうつかい", maxHp: 16, attack: 9, defense: 4, xp: 10, gold: 10 }
  ],
  high: [
    { key: "scorpion", name: "さそり", maxHp: 24, attack: 12, defense: 6, xp: 18, gold: 16 },
    { key: "knight", name: "しりょうのきし", maxHp: 32, attack: 15, defense: 8, xp: 28, gold: 22 }
  ],
  caveBoss: { key: "golem", name: "ゴーレム", maxHp: 46, attack: 16, defense: 9, xp: 45, gold: 30, boss: true },
  finalBoss: { key: "dragonlord", name: "りゅうおう", maxHp: 78, attack: 22, defense: 12, xp: 0, gold: 0, boss: true }
}

const START_POSITION = { x: 1, y: 1 }

const DIRECTIONS = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 }
}

const WEAPON_LOOKUP = Object.fromEntries(WEAPONS.map((item) => [item.id, item]))
const ARMOR_LOOKUP = Object.fromEntries(ARMORS.map((item) => [item.id, item]))

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function chooseRandom(list) {
  return list[randomInt(0, list.length - 1)]
}

function cloneEnemy(enemy) {
  return { ...enemy, hp: enemy.maxHp }
}

function createInitialState() {
  const startingProfile = LEVEL_TABLE[0]

  return {
    version: 1,
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
      hasSigil: false
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

function loadState() {
  try {
    const raw = window.localStorage.getItem(SAVE_KEY)
    if (!raw) return createInitialState()

    const parsed = JSON.parse(raw)
    if (parsed?.version !== 1) return createInitialState()

    const initial = createInitialState()
    const level = clamp(Number(parsed.player?.level) || 1, 1, LEVEL_TABLE.length)
    const profile = LEVEL_TABLE[level - 1]

    return {
      version: 1,
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
        hasSigil: Boolean(parsed.player?.hasSigil)
      },
      progress: {
        caveCleared: Boolean(parsed.progress?.caveCleared),
        dragonDefeated: Boolean(parsed.progress?.dragonDefeated)
      },
      enemy: parsed.enemy ? { ...parsed.enemy } : null,
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

    this.handleClick = this.handleClick.bind(this)
    this.handleKeydown = this.handleKeydown.bind(this)

    this.root.addEventListener("click", this.handleClick)
    window.addEventListener("keydown", this.handleKeydown)

    this.render()
  }

  destroy() {
    this.root.removeEventListener("click", this.handleClick)
    window.removeEventListener("keydown", this.handleKeydown)
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

  currentTileCode() {
    return WORLD_MAP[this.state.player.y][this.state.player.x]
  }

  currentTile() {
    return TILE_INFO[this.currentTileCode()]
  }

  currentZone() {
    if (this.state.player.x >= 7 && this.state.player.y <= 3) return "high"
    if (this.state.player.y >= 6 || this.state.player.x >= 5) return "mid"
    return "low"
  }

  persist() {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(this.state))
  }

  log(message) {
    this.state.logs.unshift(message)
    this.state.logs = this.state.logs.slice(0, 8)
  }

  saveAndRender() {
    this.persist()
    this.render()
  }

  resetGame() {
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
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d", "W", "A", "S", "D"].includes(event.key)) {
      event.preventDefault()
    }

    switch (event.key) {
      case "ArrowUp":
      case "w":
      case "W":
        this.handleCommand("move", "up")
        break
      case "ArrowDown":
      case "s":
      case "S":
        this.handleCommand("move", "down")
        break
      case "ArrowLeft":
      case "a":
      case "A":
        this.handleCommand("move", "left")
        break
      case "ArrowRight":
      case "d":
      case "D":
        this.handleCommand("move", "right")
        break
      case " ":
      case "Enter":
        this.handleCommand("action")
        break
      default:
        break
    }
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
        this.castHeal()
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

    this.state.player.x = nextX
    this.state.player.y = nextY
    this.log(`${nextTile.name}へ進んだ。`)

    if (WORLD_MAP[nextY][nextX] === "S") {
      this.state.player.hp = Math.max(0, this.state.player.hp - 1)
      this.log("沼地で1ダメージを受けた。")
      if (this.state.player.hp <= 0) {
        this.respawnAtCastle("沼地に力尽き、王に救い出された。")
        this.saveAndRender()
        return
      }
    }

    this.maybeTriggerEncounter(nextTile)
    this.saveAndRender()
  }

  maybeTriggerEncounter(tile) {
    if (tile.safe || this.state.mode === "battle") return

    let encounterRate = 0.16
    if (tile.terrain === "forest") encounterRate = 0.24
    if (tile.terrain === "swamp") encounterRate = 0.32

    if (Math.random() >= encounterRate) return

    const enemy = cloneEnemy(chooseRandom(ENEMIES[this.currentZone()]))
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

    const damage = Math.max(1, this.playerAttack() + randomInt(0, 3) - Math.floor(this.state.enemy.defense / 2))
    this.state.enemy.hp = Math.max(0, this.state.enemy.hp - damage)
    this.log(`${this.state.enemy.name}に ${damage} のダメージ。`)

    if (this.state.enemy.hp <= 0) {
      this.finishBattleVictory()
      this.saveAndRender()
      return
    }

    this.enemyTurn()
    this.saveAndRender()
  }

  castHeal() {
    if (this.state.player.mp < HEAL_SPELL_COST) {
      this.log("MPが足りない。")
      this.saveAndRender()
      return
    }

    if (this.state.player.hp >= this.playerProfile().maxHp) {
      this.log("今は回復する必要がない。")
      this.saveAndRender()
      return
    }

    this.state.player.mp -= HEAL_SPELL_COST
    const healAmount = randomInt(12, 18)
    this.state.player.hp = clamp(this.state.player.hp + healAmount, 0, this.playerProfile().maxHp)
    this.log(`ホイミを唱えた。HPが ${healAmount} 回復した。`)

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

    if (this.state.player.hp >= this.playerProfile().maxHp) {
      this.log("今は使わなくても大丈夫だ。")
      this.saveAndRender()
      return
    }

    this.state.player.herbs -= 1
    const healAmount = randomInt(10, 16)
    this.state.player.hp = clamp(this.state.player.hp + healAmount, 0, this.playerProfile().maxHp)
    this.log(`やくそうを使った。HPが ${healAmount} 回復した。`)

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

  enemyTurn() {
    if (this.state.mode !== "battle" || !this.state.enemy) return

    const enemyDamage = Math.max(1, this.state.enemy.attack + randomInt(0, 2) - Math.floor(this.playerDefense() / 2))
    this.state.player.hp = Math.max(0, this.state.player.hp - enemyDamage)
    this.log(`${this.state.enemy.name}の攻撃。${enemyDamage} ダメージを受けた。`)

    if (this.state.player.hp <= 0) {
      this.respawnAtCastle(`${this.state.enemy.name}に敗れた。王のもとで再び目を覚ます。`)
    }
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

  renderMap() {
    const rows = WORLD_MAP.map((row, y) =>
      row
        .split("")
        .map((tileCode, x) => {
          const tile = TILE_INFO[tileCode]
          const current = x === this.state.player.x && y === this.state.player.y
          const classes = ["map-tile", `terrain-${tile.terrain}`]
          if (current) classes.push("is-player")

          const content = current ? "勇" : tile.symbol

          return `<div class="${classes.join(" ")}" title="${tile.name}">${content}</div>`
        })
        .join("")
    ).join("")

    this.mapElement.innerHTML = rows
  }

  renderStats() {
    const profile = this.playerProfile()
    const weapon = WEAPON_LOOKUP[this.state.player.weapon]
    const armor = ARMOR_LOOKUP[this.state.player.armor]

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
      </div>
    `
  }

  renderContext() {
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

    this.root.querySelectorAll("button[data-command='move']").forEach((button) => {
      button.disabled = this.state.mode === "battle" || this.state.mode === "victory"
    })

    this.root.querySelector("button[data-command='attack']").disabled = this.state.mode !== "battle"
    this.root.querySelector("button[data-command='run']").disabled = this.state.mode !== "battle"
  }

  renderHeader() {
    const tile = this.currentTile()
    const battleText = this.state.enemy ? ` / ${this.state.enemy.name}と戦闘中` : ""
    this.locationElement.textContent = `${tile.name}${battleText}`
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
