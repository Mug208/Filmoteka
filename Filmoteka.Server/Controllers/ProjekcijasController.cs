
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Filmoteka.Server.Models;
using Filmoteka.Server.Data;

public class ProjekcijasController : Controller
{
    private readonly AppDbContext _context;

    public ProjekcijasController(AppDbContext context)
    {
        _context = context;
    }

    // GET: PROJEKCIJAS
    public async Task<IActionResult> Index()    
    {
        return View(await _context.Projekcije.ToListAsync());
    }

    // GET: PROJEKCIJAS/Details/5
    public async Task<IActionResult> Details(System.Guid? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var projekcija = await _context.Projekcije
            .FirstOrDefaultAsync(m => m.Id == id);
        if (projekcija == null)
        {
            return NotFound();
        }

        return View(projekcija);
    }

    // GET: PROJEKCIJAS/Create
    public IActionResult Create()
    {
        return View();
    }

    // POST: PROJEKCIJAS/Create
    // To protect from overposting attacks, enable the specific properties you want to bind to.
    // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([Bind("Id,FilmId,Film,SalaId,Sala,VremePocetka,VremeZavrsetka,DostupnaMesta,Rezervacije")] Projekcija projekcija)
    {
        if (ModelState.IsValid)
        {
            _context.Add(projekcija);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
        return View(projekcija);
    }

    // GET: PROJEKCIJAS/Edit/5
    public async Task<IActionResult> Edit(System.Guid? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var projekcija = await _context.Projekcije.FindAsync(id);
        if (projekcija == null)
        {
            return NotFound();
        }
        return View(projekcija);
    }

    // POST: PROJEKCIJAS/Edit/5
    // To protect from overposting attacks, enable the specific properties you want to bind to.
    // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(System.Guid? id, [Bind("Id,FilmId,Film,SalaId,Sala,VremePocetka,VremeZavrsetka,DostupnaMesta,Rezervacije")] Projekcija projekcija)
    {
        if (id != projekcija.Id)
        {
            return NotFound();
        }

        if (ModelState.IsValid)
        {
            try
            {
                _context.Update(projekcija);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProjekcijaExists(projekcija.Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return RedirectToAction(nameof(Index));
        }
        return View(projekcija);
    }

    // GET: PROJEKCIJAS/Delete/5
    public async Task<IActionResult> Delete(System.Guid? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var projekcija = await _context.Projekcije
            .FirstOrDefaultAsync(m => m.Id == id);
        if (projekcija == null)
        {
            return NotFound();
        }

        return View(projekcija);
    }

    // POST: PROJEKCIJAS/Delete/5
    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(System.Guid? id)
    {
        var projekcija = await _context.Projekcije.FindAsync(id);
        if (projekcija != null)
        {
            _context.Projekcije.Remove(projekcija);
        }

        await _context.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }

    private bool ProjekcijaExists(System.Guid? id)
    {
        return _context.Projekcije.Any(e => e.Id == id);
    }
}
