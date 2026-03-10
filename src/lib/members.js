import tienPixel from '../assets/tien_pixel.jpg'
import cnhuuuPixel from '../assets/cnhuuu_pixel.jpg'
import viePixel from '../assets/vie_pixel.jpg'
import chuoiPixel from '../assets/chuoi_pixel.jpg'
import rosiePixel from '../assets/rosie_pixel.jpg'
import thuongPixel from '../assets/thuong_pixel.jpg'
import uoaPixel from '../assets/uoa_pixel.jpg'
import linhchouPixel from '../assets/linhchou_pixel.jpg'
import bimPixel from '../assets/bim_pixel.jpg'

export const MEMBERS = [
    {
        id: 1,
        name: "Lê Hoàng Vĩnh Nghi",
        nickname: "Bim",
        role: "Bim Rooney",
        level: 24,
        color: "#FF6B6B",
        bgColor: "#FF6B6B20",
        emoji: "🐉",
        avatar: bimPixel,
        bio: "The fierce warrior who charges headfirst into every adventure!",
        stats: { strength: 90, agility: 75, wisdom: 60, charisma: 80 },
        achievements: ["IT", "Đẹp Trai", "Tài Xế"],
        joinDate: "2020-01-15"
    },
    {
        id: 2,
        name: "Nguyễn Thị Châu Như",
        nickname: "Cnhuuu",
        role: "Như",
        level: 22,
        color: "#A855F7",
        bgColor: "#A855F720",
        emoji: "✨",
        avatar: cnhuuuPixel,
        bio: "Weaving spells and solving problems with pure intellect.",
        stats: { strength: 50, agility: 65, wisdom: 95, charisma: 85 },
        achievements: ["Lé Biên Bất Ngờ", "Wollongong Girl", "Xinh Gái"],
        joinDate: "2020-02-10"
    },
    {
        id: 3,
        name: "Lê Trần Nhật Thương",
        nickname: "Thương",
        role: "Popping Girl",
        level: 20,
        color: "#10B981",
        bgColor: "#10B98120",
        emoji: "🗡️",
        avatar: thuongPixel,
        bio: "Silent, swift, and deadly. Strikes from the shadows.",
        stats: { strength: 70, agility: 95, wisdom: 70, charisma: 60 },
        achievements: ["Em Út", "Popping Girl", "Hát Hay Nhất Nhóm"],
        joinDate: "2020-03-05"
    },
    {
        id: 4,
        name: "Đinh Nguyễn Hoàng Vy",
        nickname: "Vie",
        role: "Vie",
        level: 23,
        color: "#F59E0B",
        bgColor: "#F59E0B20",
        emoji: "⚔️",
        avatar: viePixel,
        bio: "Guardian of the team, standing firm when others falter.",
        stats: { strength: 85, agility: 60, wisdom: 75, charisma: 90 },
        achievements: ["Lé Biên Trường Tồn", "Người Lập Kèo", "Chị Đại"],
        joinDate: "2020-01-20"
    },
    {
        id: 5,
        name: "Cao Nguyễn Linh Châu",
        nickname: "Linh Chou",
        role: "Linh Chou",
        level: 21,
        color: "#EC4899",
        bgColor: "#EC489920",
        emoji: "💫",
        avatar: linhchouPixel,
        bio: "Brings life to the dying and hope to the hopeless.",
        stats: { strength: 45, agility: 70, wisdom: 90, charisma: 95 },
        achievements: ["Bắc Kì Tạm Thời", "Ngoại Giao", "Đánh Bài Dốt"],
        joinDate: "2020-04-01"
    },
    {
        id: 6,
        name: "Phạm Khánh Quỳnh",
        nickname: "Chuối",
        role: "Chuối",
        level: 19,
        color: "#06B6D4",
        bgColor: "#06B6D420",
        emoji: "🏹",
        avatar: chuoiPixel,
        bio: "Never misses. Patient, precise, and always on target.",
        stats: { strength: 65, agility: 88, wisdom: 80, charisma: 70 },
        achievements: ["Chúi", "FTU Girl", "Người lập kèo"],
        joinDate: "2020-05-15"
    },
    {
        id: 7,
        name: "Nguyễn Hữu Tiến",
        nickname: "Miller Nguyễn",
        role: "Miller",
        level: 25,
        color: "#EF4444",
        bgColor: "#EF444420",
        emoji: "🔥",
        avatar: tienPixel,
        bio: "Unstoppable force of nature. The berserker who never backs down.",
        stats: { strength: 98, agility: 70, wisdom: 55, charisma: 65 },
        achievements: ["Miller Nguyễn", "Thợ Đụ", "Già trước tuổi"],
        joinDate: "2019-12-01"
    },
    {
        id: 8,
        name: "Đặng Nguyễn Xuân Ngân",
        nickname: "Ú Oà",
        role: "Winter",
        level: 18,
        color: "#8B5CF6",
        bgColor: "#8B5CF620",
        emoji: "🎵",
        avatar: uoaPixel,
        bio: "Songs that inspire victory and laughter in equal measure.",
        stats: { strength: 55, agility: 75, wisdom: 85, charisma: 98 },
        achievements: ["Thần Bài", "Winter", "Ú Oà"],
        joinDate: "2020-06-10"
    },
    {
        id: 9,
        name: "Đặng Kim Xuân Hà",
        nickname: "Rôsie",
        role: "Rosie",
        level: 20,
        color: "#0EA5E9",
        bgColor: "#0EA5E920",
        emoji: "❄️",
        avatar: rosiePixel,
        bio: "Cool under pressure. Controls the battlefield with ice magic.",
        stats: { strength: 60, agility: 80, wisdom: 92, charisma: 75 },
        achievements: ["Tiktok Music", "Fire Girl", "EY Girl"],
        joinDate: "2020-07-20"
    }
]

export const getMemberByNickname = (nickname) =>
    MEMBERS.find(m => m.nickname === nickname)

export const getMemberById = (id) =>
    MEMBERS.find(m => m.id === id)