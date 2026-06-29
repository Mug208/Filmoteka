
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Filmoteka.Server.Models;
using Filmoteka.Server.Data;

public class RezervacijasController : Controller
{
    private readonly AppDbContext _context;

    public RezervacijasController(AppDbContext context)
    {
        _context = context;
    }

    // GET: REZERVACIJAS
    public async Task<IActionResult> Index()    
    {
        return View(await _context.Rezervacije.ToListAsync());
    }

    // GET: REZERVACIJAS/Details/5
    public async Task<IActionResult> Details(System.Guid? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var rezervacija = await _context.Rezervacije
            .FirstOrDefaultAsync(m => m.Id == id);
        if (rezervacija == null)
        {
            return NotFound();
        }

        return View(rezervacija);
    }

    // GET: REZERVACIJAS/Create
    public IActionResult Create()
    {
        return View();
    }

    // POST: REZERVACIJAS/Create
    // To protect from overposting attacks, enable the specific properties you want to bind to.
    // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([Bind("Id,ProjekcijaId,Projekcija,KorisnikIme,KorisnikEmail,DatumRezervacije")] Rezervacija rezervacija)
    {
        if (ModelState.IsValid)
        {
            _context.Add(rezervacija);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
        return View(rezervacija);
    }

    // GET: REZERVACIJAS/Edit/5
    public async Task<IActionResult> Edit(System.Guid? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var rezervacija = await _context.Rezervacije.FindAsync(id);
        if (rezervacija == null)
        {
            return NotFound();
        }
        return View(rezervacija);
    }

    // POST: REZERVACIJAS/Edit/5
    // To protect from overposting attacks, enable the specific properties you want to bind to.
    // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(System.Guid? id, [Bind("Id,ProjekcijaId,Projekcija,KorisnikIme,KorisnikEmail,DatumRezervacije")] Rezervacija rezervacija)
    {
        if (id != rezervacija.Id)
        {
            return NotFound();
        }

        if (ModelState.IsValid)
        {
            try
            {
                _context.Update(rezervacija);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RezervacijaExists(rezervacija.Id))
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
        return View(rezervacija);
    }

    // GET: REZERVACIJAS/Delete/5
    public async Task<IActionResult> Delete(System.Guid? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var rezervacija = await _context.Rezervacije
            .FirstOrDefaultAsync(m => m.Id == id);
        if (rezervacija == null)
        {
            return NotFound();
        }

        return View(rezervacija);
    }

    // POST: REZERVACIJAS/Delete/5
    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(System.Guid? id)
    {
        var rezervacija = await _context.Rezervacije.FindAsync(id);
        if (rezervacija != null)
        {
            _context.Rezervacije.Remove(rezervacija);
        }

        await _context.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }

    private bool RezervacijaExists(System.Guid? id)
    {
        return _context.Rezervacije.Any(e => e.Id == id);
    }
}
